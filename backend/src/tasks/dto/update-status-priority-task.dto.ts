import { IsDefined, IsEnum, IsOptional } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums/task.enums';

export class UpdateStatusPriorityTaskDto {
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;
}