import { 
  Controller, Get, Post, Body, Patch, Param, 
  ParseIntPipe, UseGuards, Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Dùng hàng chính hãng giống user.controller
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './noti.service.js';
import { CreateNotificationDto } from './dto/noti.dto.js';

@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // Sửa: Dùng AuthGuard('jwt') thay vì JwtGuard
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getMyNotifications(@Request() req) { 
    // Thay vì @GetUser, ta dùng @Request() req rồi lấy req.user.id
    return this.notificationService.getMyNotifications(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(
    @Request() req,
    @Param('id', ParseIntPipe) notiId: number,
  ) {
    return this.notificationService.markAsRead(notiId, req.user.id);
  }

  @Post()
  createTestNotification(
    @Request() req,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.notificationService.create(dto, req.user.id);
  }
}