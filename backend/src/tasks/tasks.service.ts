import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TasksDao } from './tasks.dao';
import { CreateTaskDto } from './dto/create-task.dto';
import { FiltersTaskDto } from './dto/filters-task.dto';
import { UpdateStatusPriorityTaskDto } from './dto/update-status-priority-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { UsersService } from '../users/users.service';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksDao: TasksDao,
    private readonly usersService: UsersService
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const dtoTask = {
      ...createTaskDto,
      userId,
    };

    return this.tasksDao.create(dtoTask);
  }

  findAllByAdmin(filters: FiltersTaskDto) {
    return this.tasksDao.findAll(filters, 'all');
  }

  async findAllByUser(userId: string, filters: FiltersTaskDto) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.tasksDao.findAll(filters, { userId });
  }

  async findById(userInfo: JwtPayload, id: string) {
    const user = await this.usersService.findOne(userInfo.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = await this.tasksDao.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (userInfo.role === UserRole.USER) {
      if (task.userId !== userInfo.sub) {
        throw new NotFoundException('You do not have access to this task.');
      }
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.tasksDao.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new NotFoundException('You cannot update this task because you do not have access to it.');
    }

    return this.tasksDao.update(id, updateTaskDto);
  }

  async updateStatus(
    id: string, updateTaskStatusPriorityDto: UpdateStatusPriorityTaskDto, userId: string
  ) {
    const task = await this.tasksDao.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new NotFoundException('You cannot update this task because you do not have access to it.');
    }

    return this.tasksDao.update(id, updateTaskStatusPriorityDto);
  }

  async remove(id: string, userId: string) {
    const task = await this.tasksDao.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new NotFoundException('You cannot delete this task because you do not have access to it.');
    }

    return this.tasksDao.remove(id);
  }
}
