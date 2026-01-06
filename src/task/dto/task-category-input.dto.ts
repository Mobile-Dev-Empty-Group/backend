import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class TaskCategoryInputDto {
  @ApiProperty({ description: 'If true, create a new category' })
  @IsBoolean()
  new!: boolean;

  @ApiPropertyOptional({
    description: 'Existing category id (required when new=false)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  id?: string;

  @ApiPropertyOptional({
    description: 'New category name (required when new=true)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({
    description: 'New category icon (optional when new=true)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  icon?: string;
}
