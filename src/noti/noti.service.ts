import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { CreateNotificationDto } from './dto/noti.dto.js';

@Injectable()
export class NotificationService {
  constructor(@Inject('PRISMA') private prisma: PrismaClient) {}

  // 1. Sửa tham số targetUserId thành string
  async create(dto: CreateNotificationDto, targetUserId?: string) {
    const userId = dto.userId || targetUserId;
    
    // Kiểm tra an toàn: userId bắt buộc phải có
    if (!userId) {
        throw new Error("User ID is required for notification");
    }

    return this.prisma.notification.create({
      data: {
        title: dto.title,
        message: dto.message,
        userId: userId, // Lúc này userId đã là string, khớp với DB
      },
    });
  }

  // 2. Sửa tham số userId thành string
  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 3. Sửa tham số userId thành string
  async markAsRead(notificationId: number, userId: string) {
    const noti = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    // Lúc này cả noti.userId và userId đều là string nên so sánh được
    if (!noti || noti.userId !== userId) {
      throw new NotFoundException('Notification not found or access denied');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}