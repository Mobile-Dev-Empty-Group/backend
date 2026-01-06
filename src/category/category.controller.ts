import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service.js';
import { CategoryAdapterDto } from './dto/category.dto.js';
import { GetCategoryAdapterQueryDto } from './dto/get-category-adapter-query.dto.js';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('adapter')
  @ApiOperation({
    summary: 'Get categories for adapter {label:id, value:name}',
  })
  @ApiOkResponse({ type: CategoryAdapterDto, isArray: true })
  getCategoryAdapter(@Query() query: GetCategoryAdapterQueryDto) {
    return this.categoryService.getCategoryAdapter(query);
  }
}
