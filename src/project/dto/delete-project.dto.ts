import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class DeleteProjectDto {
  @ApiProperty({ description: 'Authenticated user id (uid)' })
  @IsString()
  @MinLength(1)
  uid!: string;

  @ApiProperty({ description: 'Project id' })
  @IsString()
  @MinLength(1)
  id!: string;
}
