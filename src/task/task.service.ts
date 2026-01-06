import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { DeleteTaskDto } from './dto/delete-task.dto.js';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto.js';
import { TaskCategoryInputDto } from './dto/task-category-input.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TaskService {
  private async resolveCategoryIdForCreate(
    userId: string,
    input?: TaskCategoryInputDto,
  ) {
    if (!input) return undefined;

    if (input.new) {
      if (!input.name) {
        throw new BadRequestException(
          'category.name is required when category.new=true',
        );
      }

      const created = await prisma.category.create({
        data: {
          name: input.name,
          icon: input.icon,
          userId,
        },
        select: { id: true },
      });

      return created.id;
    }

    if (!input.id) {
      throw new BadRequestException(
        'category.id is required when category.new=false',
      );
    }
    return input.id;
  }

  async getTasks(query: GetTasksQueryDto) {
    return prisma.task.findMany({
      where: {
        ...(query.id ? { id: query.id } : {}),
        userId: query.uid,
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.projectId ? { projectId: query.projectId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.isStarred !== undefined
          ? { isStarred: query.isStarred }
          : {}),
        ...(query.progress !== undefined ? { progress: query.progress } : {}),
        ...(query.title
          ? {
              title: {
                contains: query.title,
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskAdapter(query: GetTasksQueryDto) {
    const rows = await prisma.task.findMany({
      where: {
        ...(query.id ? { id: query.id } : {}),
        userId: query.uid,
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.projectId ? { projectId: query.projectId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    });

    return rows.map((t) => ({ label: t.id, value: t.title }));
  }

  async createTask(dto: CreateTaskDto) {
    const categoryId = await this.resolveCategoryIdForCreate(
      dto.uid,
      dto.category,
    );

    return prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        progress: dto.progress,
        isStarred: dto.isStarred,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        duration: dto.duration,
        breakTime: dto.breakTime,
        repeatDay: dto.repeatDay,
        completedAt: dto.completedAt,
        userId: dto.uid,
        projectId: dto.projectId,
        categoryId,
      },
    });
  }

  async updateTask(dto: UpdateTaskDto) {
    const existing = await prisma.task.findFirst({
      where: { id: dto.id, userId: dto.uid },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Task not found');

    const categoryId = await this.resolveCategoryIdForCreate(
      dto.uid,
      dto.category,
    );

    try {
      return await prisma.task.update({
        where: { id: dto.id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.progress !== undefined ? { progress: dto.progress } : {}),
          ...(dto.isStarred !== undefined ? { isStarred: dto.isStarred } : {}),
          ...(dto.date !== undefined ? { date: dto.date } : {}),
          ...(dto.startTime !== undefined ? { startTime: dto.startTime } : {}),
          ...(dto.endTime !== undefined ? { endTime: dto.endTime } : {}),
          ...(dto.duration !== undefined ? { duration: dto.duration } : {}),
          ...(dto.breakTime !== undefined ? { breakTime: dto.breakTime } : {}),
          ...(dto.repeatDay !== undefined ? { repeatDay: dto.repeatDay } : {}),
          ...(dto.completedAt !== undefined
            ? { completedAt: dto.completedAt }
            : {}),
          ...(dto.projectId !== undefined ? { projectId: dto.projectId } : {}),
          ...(categoryId !== undefined ? { categoryId } : {}),
        },
      });
    } catch (err) {
      const error = err as { code?: string } | undefined;
      if (error?.code === 'P2025')
        throw new NotFoundException('Task not found');
      throw err;
    }
  }

  async deleteTask(dto: DeleteTaskDto) {
    const existing = await prisma.task.findFirst({
      where: { id: dto.id, userId: dto.uid },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Task not found');

    return prisma.task.delete({ where: { id: dto.id } });
  }
}
