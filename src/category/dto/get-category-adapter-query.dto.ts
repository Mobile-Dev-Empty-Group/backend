import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class GetCategoryAdapterQueryDto {
  @ApiProperty({ description: 'Authenticated user id (uid)' })
  @IsString()
  @MinLength(1)
  uid!: string;

  @ApiPropertyOptional({ description: 'Filter by name (contains)' })
  @IsOptional()
  @IsString()
  name?: string;
}
