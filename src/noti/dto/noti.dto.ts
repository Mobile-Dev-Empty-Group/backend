import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Nhắc nhở bài tập' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Bạn có bài tập Mobile Dev hạn nộp ngày mai' })
  @IsString()
  @IsOptional()
  message?: string;

  // Trường này tùy chọn, nếu admin gửi thì cần userId đích
  @ApiProperty({ example: 1 })
  @IsString()
  @IsOptional()
  userId?: string;
}