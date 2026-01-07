import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common'; 
import { PrismaClient } from '../../generated/prisma/client.js'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('PRISMA') private prisma: PrismaClient) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        
        if (!user) return null; // Trả về null nếu không tìm thấy user

        // Kỹ thuật tách password ra khỏi object (thay cho delete)
        const { password, ...result } = user;
        
        return result;
    }
}