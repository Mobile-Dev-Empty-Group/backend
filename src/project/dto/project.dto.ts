import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  userId!: string;
}

export class ProjectAdapterDto {
  @ApiProperty({ description: 'Project id' })
  label!: string;

  @ApiProperty({ description: 'Project name' })
  value!: string;
}
