import { Module } from '@nestjs/common';
import { NotificationService } from './noti.service.js';
import { NotificationController } from './noti.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {} 
