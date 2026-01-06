import { ApiProperty } from '@nestjs/swagger';

export class CategoryAdapterDto {
  @ApiProperty({ description: 'Category id' })
  label!: string;

  @ApiProperty({ description: 'Category name' })
  value!: string;
}
