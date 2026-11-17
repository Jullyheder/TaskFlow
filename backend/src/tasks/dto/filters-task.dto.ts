import {
    IsEnum, IsOptional,
    IsString, MaxLength
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums/task.enums';

export class FiltersTaskDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;
}
