import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma/prisma.service.js';
import { GetCategoryAdapterQueryDto } from './dto/get-category-adapter-query.dto.js';

@Injectable()
export class CategoryService {
  async getCategoryAdapter(query: GetCategoryAdapterQueryDto) {
    const rows = await prisma.category.findMany({
      where: {
        userId: query.uid,
        ...(query.name
          ? {
              name: {
                contains: query.name,
              },
            }
          : {}),
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return rows.map((c) => ({ label: c.id, value: c.name }));
  }
}
