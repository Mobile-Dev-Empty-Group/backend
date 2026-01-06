import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class GetProjectsQueryDto {
  @ApiProperty({ description: 'Authenticated user id (uid)' })
  @IsString()
  @MinLength(1)
  uid!: string;

  @ApiPropertyOptional({ description: 'Filter by project id' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'Filter by name (contains, case-insensitive)',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
