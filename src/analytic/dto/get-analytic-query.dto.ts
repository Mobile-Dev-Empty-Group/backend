import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class GetAnalyticQueryDto {
  @ApiProperty({
    enum: ['week', 'month'],
    description: 'Analytics window type',
  })
  @IsIn(['week', 'month'])
  type!: 'week' | 'month';

  @ApiProperty({ description: 'Authenticated user id (uid)' })
  @IsString()
  @MinLength(1)
  uid!: string;

  @ApiPropertyOptional({
    description:
      'Reference date (ISO). If omitted, uses current date. Week/month range is computed from this.',
  })
  @IsOptional()
  @Type(() => Date)
  date?: Date;
}
