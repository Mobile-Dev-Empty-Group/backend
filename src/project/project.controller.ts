import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { DeleteProjectDto } from './dto/delete-project.dto.js';
import { GetProjectsQueryDto } from './dto/get-projects-query.dto.js';
import { ProjectAdapterDto, ProjectDto } from './dto/project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectService } from './project.service.js';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get projects (supports query filter)' })
  @ApiOkResponse({ type: ProjectDto, isArray: true })
  getProjects(@Query() query: GetProjectsQueryDto) {
    return this.projectService.getProjects(query);
  }

  @Get('adapter')
  @ApiOperation({ summary: 'Get projects for adapter {label:id, value:name}' })
  @ApiOkResponse({ type: ProjectAdapterDto, isArray: true })
  getProjectAdapter(@Query() query: GetProjectsQueryDto) {
    return this.projectService.getProjectAdapter(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiOkResponse({ type: ProjectDto })
  createProject(@Body() body: CreateProjectDto) {
    return this.projectService.createProject(body);
  }

  @Put()
  @ApiOperation({ summary: 'Update a project' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiOkResponse({ type: ProjectDto })
  updateProject(@Body() body: UpdateProjectDto) {
    return this.projectService.updateProject(body);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a project' })
  @ApiBody({ type: DeleteProjectDto })
  @ApiOkResponse({ type: ProjectDto })
  deleteProject(@Body() body: DeleteProjectDto) {
    return this.projectService.deleteProject(body);
  }
}
