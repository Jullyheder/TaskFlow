import {
  Controller, Get, Post, Body, Query,
  Patch, Param, Delete, UseGuards
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FiltersTaskDto } from './dto/filters-task.dto';
import { UpdateStatusPriorityTaskDto } from './dto/update-status-priority-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { CurrentUser } from '../auth/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { UserRole } from '../users/enums/user-role.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() userInfo: JwtPayload,
  ) {
    return this.tasksService.create(userInfo.sub, createTaskDto);
  }

  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  findAllByAdmin(
    @Query() filters: FiltersTaskDto,
  ) {
    return this.tasksService.findAllByAdmin(filters);
  }

  @Get('')
  findAllByUser(
    @CurrentUser() userInfo: JwtPayload,
    @Query() filters: FiltersTaskDto,
  ) {
    return this.tasksService.findAllByUser(userInfo.sub, filters);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @CurrentUser() userInfo: JwtPayload,
  ) {
    return this.tasksService.findById(userInfo, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() userInfo: JwtPayload,
  ) {
    return this.tasksService.update(id, updateTaskDto, userInfo.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusPriorityDto: UpdateStatusPriorityTaskDto,
    @CurrentUser() userInfo: JwtPayload,
  ) {
    return this.tasksService.updateStatus(id, updateTaskStatusPriorityDto, userInfo.sub);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() userInfo: JwtPayload,
  ) {
    return this.tasksService.remove(id, userInfo.sub);
  }
}
