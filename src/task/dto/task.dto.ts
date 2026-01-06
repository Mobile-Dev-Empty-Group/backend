import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  progress!: number;

  @ApiProperty()
  isStarred!: boolean;

  @ApiPropertyOptional()
  date?: Date | null;

  @ApiPropertyOptional()
  startTime?: Date | null;

  @ApiPropertyOptional()
  endTime?: Date | null;

  @ApiPropertyOptional()
  duration?: number | null;

  @ApiPropertyOptional()
  breakTime?: number | null;

  @ApiPropertyOptional()
  repeatDay?: string | null;

  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional()
  categoryId?: string | null;

  @ApiPropertyOptional()
  projectId?: string | null;

  @ApiPropertyOptional()
  completedAt?: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class TaskAdapterDto {
  @ApiProperty({ description: 'Task id' })
  label!: string;

  @ApiProperty({ description: 'Task title' })
  value!: string;
}
