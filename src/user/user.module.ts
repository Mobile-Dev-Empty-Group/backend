import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule], // Cần PrismaModule để inject 'PRISMA'
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export nếu module khác cần dùng
})
export class UserModule {}