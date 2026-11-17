import {
    IsString, IsNotEmpty, IsOptional, IsEnum
} from 'class-validator';

import { TaskStatus, TaskPriority } from '../enums/task.enums';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;
}
