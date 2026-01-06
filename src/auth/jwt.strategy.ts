import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common'; 
import { PrismaClient } from '../../generated/prisma/client'; 

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
    // Payload.sub chứa userId (String)
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (user) delete user.password;
    return user;
  }
}