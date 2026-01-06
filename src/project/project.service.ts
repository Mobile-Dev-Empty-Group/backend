import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { DeleteProjectDto } from './dto/delete-project.dto.js';
import { GetProjectsQueryDto } from './dto/get-projects-query.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectService {
  async getProjects(query: GetProjectsQueryDto) {
    return prisma.project.findMany({
      where: {
        ...(query.id ? { id: query.id } : {}),
        userId: query.uid,
        ...(query.name
          ? {
              name: {
                contains: query.name,
              },
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async getProjectAdapter(query: GetProjectsQueryDto) {
    const rows = await prisma.project.findMany({
      where: {
        ...(query.id ? { id: query.id } : {}),
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

    return rows.map((p) => ({ label: p.id, value: p.name }));
  }

  async createProject(dto: CreateProjectDto) {
    return prisma.project.create({
      data: {
        name: dto.name,
        userId: dto.uid,
      },
    });
  }

  async updateProject(dto: UpdateProjectDto) {
    const existing = await prisma.project.findFirst({
      where: { id: dto.id, userId: dto.uid },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Project not found');

    return prisma.project.update({
      where: { id: dto.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
      },
    });
  }

  async deleteProject(dto: DeleteProjectDto) {
    const existing = await prisma.project.findFirst({
      where: { id: dto.id, userId: dto.uid },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Project not found');

    return prisma.project.delete({ where: { id: dto.id } });
  }
}
