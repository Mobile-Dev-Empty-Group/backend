import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class GetTasksQueryDto {
  @ApiProperty({ description: 'Authenticated user id (uid)' })
  @IsString()
  @MinLength(1)
  uid!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ enum: ['TO_DO', 'IN_PROGRESS', 'COMPLETED'] })
  @IsOptional()
  @IsIn(['TO_DO', 'IN_PROGRESS', 'COMPLETED'])
  status?: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';

  @ApiPropertyOptional({ description: 'Filter by title contains' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  progress?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isStarred?: boolean;
}
