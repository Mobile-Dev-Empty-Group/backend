import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TaskCategoryInputDto } from './task-category-input.dto.js';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Authenticated user id (uid)' })
  @IsString()
  @MinLength(1)
  uid!: string;

  @ApiProperty({ description: 'Task id' })
  @IsString()
  @MinLength(1)
  id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['TO_DO', 'IN_PROGRESS', 'COMPLETED'] })
  @IsOptional()
  @IsIn(['TO_DO', 'IN_PROGRESS', 'COMPLETED'])
  status?: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';

  @ApiPropertyOptional({ minimum: 0, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isStarred?: boolean;

  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({ description: 'ISO date-time string' })
  @IsOptional()
  @Type(() => Date)
  startTime?: Date;

  @ApiPropertyOptional({ description: 'ISO date-time string' })
  @IsOptional()
  @Type(() => Date)
  endTime?: Date;

  @ApiPropertyOptional({ description: 'Duration in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ description: 'Break time in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  breakTime?: number;

  @ApiPropertyOptional({
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  })
  @IsOptional()
  @IsIn([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  repeatDay?:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

  @ApiPropertyOptional({ description: 'ISO date-time string' })
  @IsOptional()
  @Type(() => Date)
  completedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  projectId?: string;

  @ApiPropertyOptional({ type: TaskCategoryInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskCategoryInputDto)
  category?: TaskCategoryInputDto;
}
