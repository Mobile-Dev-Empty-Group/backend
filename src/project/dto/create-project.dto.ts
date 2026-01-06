import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Authenticated user id (uid)' })
  @IsString()
  @MinLength(1)
  uid!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;
}
