import { BadRequestException, Injectable, UnauthorizedException, NotFoundException , Inject} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto.js';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject('PRISMA') private prisma: PrismaClient,    
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // 1. REGISTER
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name, 
        provider: 'EMAIL', // Default provider
      },
    });

    return this.signToken(user.id, user.email);
  }

  // 2. LOGIN
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Wrong credentials');

    // Nếu user đăng ký bằng Google/Facebook thì password sẽ null
    if (!user.password) throw new UnauthorizedException('Please login with Social Account');

    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) throw new UnauthorizedException('Wrong credentials');

    return this.signToken(user.id, user.email);
  }

  // 3. CHANGE PASSWORD
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    if (!user.password) throw new BadRequestException('Account has no password set (Social Login)');

    const pwMatches = await bcrypt.compare(dto.oldPassword, user.password);
    if (!pwMatches) throw new BadRequestException('Old password incorrect');

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  // 4. FORGOT PASSWORD (Tạo OTP lưu vào bảng password_resets)
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    // Tạo mã OTP 5 số ngẫu nhiên
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Hết hạn sau 15 phút

    // Lưu vào bảng PasswordReset
    await this.prisma.passwordReset.create({
      data: {
        email: dto.email,
        code: otp,
        expiresAt: expiresAt
      }
    });

    // TODO: Gửi email thật ở đây (dùng Nodemailer)
    await this.mailService.sendForgotPassword(dto.email, otp);
    return { message: 'OTP has been sent to your email' };
  }

  // 5. RESET PASSWORD (Dùng OTP để set lại pass)
  async resetPassword(dto: ResetPasswordDto) {
    // Tìm mã OTP hợp lệ gần nhất
    const resetRecord = await this.prisma.passwordReset.findFirst({
      where: {
        email: dto.email,
        code: dto.code,
        expiresAt: { gt: new Date() } // Chưa hết hạn
      },
      orderBy: { id: 'desc' } // Lấy cái mới nhất
    });

    if (!resetRecord) throw new BadRequestException('Invalid or expired OTP');

    // Hash pass mới và update User
    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: newHashedPassword }
    });

    // Xóa record reset để không dùng lại được (Optional)
    await this.prisma.passwordReset.delete({ where: { id: resetRecord.id } });

    return { message: 'Password reset successfully' };
  }

  // Helper tạo Token
  private async signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'secretKey', // Nhớ config .env
        expiresIn: '7d',
      }),
    };
  }
}