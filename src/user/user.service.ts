import { Injectable, NotFoundException, Inject } from '@nestjs/common';
// Import PrismaClient đúng đường dẫn generated và có .js
import { PrismaClient } from '../../generated/prisma/client.js';
import { UpdateProfileDto, UpdateSettingsDto } from './dto/user.dto.js';

@Injectable()
export class UserService {
  constructor(@Inject('PRISMA') private prisma: PrismaClient) {}

  // 1. Lấy thông tin User (Profile)
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) throw new NotFoundException('User not found');
    
    // Loại bỏ password trước khi trả về
    const { password, ...result } = user;
    return result;
  }

  // 2. Cập nhật Profile (Tên, Avatar)
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    const { password, ...result } = user;
    return result;
  }

  // 3. Cập nhật Cài đặt (Settings)
  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    const { password, ...result } = user;
    return result;
  }

  // 4. Đánh dấu đã xong hướng dẫn (Onboarding)
  async finishOnboarding(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hasFinishedOnboarding: true },
    });
    return { success: true };
  }
}