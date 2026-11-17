import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TasksDao } from './tasks.dao';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './schemas/task.schema';

import { UsersModule } from '../users/users.module';
import { AuthJwtModule } from '../auth/auth-jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema
      }
    ]),
    AuthJwtModule,
    UsersModule
  ],

  controllers: [TasksController],

  providers: [TasksService, TasksDao],
})
export class TasksModule {}
