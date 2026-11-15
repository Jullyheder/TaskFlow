import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersDao {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    async findAll() {
        return this.userModel.find().exec();
    }

    async findById(id: string) {
        return this.userModel.findOne({ _id: id }).exec();
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async findByEmailWithPassword(email: string) {
        return this.userModel
        .findOne({ email })
        .select('+password')
        .exec();
    }

    async create(data: CreateUserDto) {
        return this.userModel.create(data);
    }

    async update(id: string, data: Partial<CreateUserDto>) {
        return this.userModel.findByIdAndUpdate(
            id, data, { returnDocument: 'after' }
        ).exec();
    }

    async delete(id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}