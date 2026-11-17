import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { FiltersTaskDto } from './dto/filters-task.dto';

type CreateTaskData = CreateTaskDto & { userId: string };

@Injectable()
export class TasksDao {
    constructor(
        @InjectModel(Task.name)
        private readonly taskModel: Model<Task>,
    ) {}

    async findAll(filters: FiltersTaskDto, scope: 'all' | { userId: string }) {
        const query: QueryFilter<Task> = 
            scope === 'all' ? {} : { userId: scope.userId };

        if (filters.status !== undefined) query.status = filters.status;
        if (filters.priority !== undefined) query.priority = filters.priority;

        const term = filters.search?.trim();
        if (term) {
            const literal = term.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&');
            query.title = { $regex: literal, $options: 'i' };
        }

        return this.taskModel.find(query).exec();
    }

    async findById(id: string) {
        return this.taskModel.findOne({ _id: id }).exec();
    }

    async create(data: CreateTaskData) {
        return this.taskModel.create(data);
    }
    
    async update(id: string, data: Partial<CreateTaskDto>) {
        return this.taskModel.findByIdAndUpdate(
            id, data, { returnDocument: 'after' }
        ).exec();
    }

    async remove(id: string) {
        return this.taskModel.findByIdAndDelete(id).exec();
    }
}