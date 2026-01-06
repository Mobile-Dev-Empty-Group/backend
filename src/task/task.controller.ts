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
import { CreateTaskDto } from './dto/create-task.dto.js';
import { DeleteTaskDto } from './dto/delete-task.dto.js';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto.js';
import { TaskAdapterDto, TaskDto } from './dto/task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskService } from './task.service.js';

@Controller('task')
@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get tasks (supports query filter)' })
  @ApiOkResponse({ type: TaskDto, isArray: true })
  getTasks(@Query() query: GetTasksQueryDto) {
    return this.taskService.getTasks(query);
  }

  @Get('adapter')
  @ApiOperation({ summary: 'Get tasks for adapter {label:id, value:title}' })
  @ApiOkResponse({ type: TaskAdapterDto, isArray: true })
  getTaskAdapter(@Query() query: GetTasksQueryDto) {
    return this.taskService.getTaskAdapter(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task (supports creating new category)' })
  @ApiBody({ type: CreateTaskDto })
  @ApiOkResponse({ type: TaskDto })
  createTask(@Body() body: CreateTaskDto) {
    return this.taskService.createTask(body);
  }

  @Put()
  @ApiOperation({ summary: 'Update a task (supports creating new category)' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({ type: TaskDto })
  updateTask(@Body() body: UpdateTaskDto) {
    return this.taskService.updateTask(body);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a task' })
  @ApiBody({ type: DeleteTaskDto })
  @ApiOkResponse({ type: TaskDto })
  deleteTask(@Body() body: DeleteTaskDto) {
    return this.taskService.deleteTask(body);
  }
}
