import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { TaskStatus, TaskPriority } from '../enums/task.enums';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        type: String,
        enum: TaskStatus,
        default: TaskStatus.TODO,
        required: true
    })
    status: TaskStatus;

    @Prop({
        type: String,
        enum: TaskPriority,
        default: TaskPriority.LOW,
        required: true
    })
    priority: TaskPriority;

    @Prop({ required: true, index: true })
    userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);