import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { UserRole } from '../enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.USER,
        required: true
    })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);