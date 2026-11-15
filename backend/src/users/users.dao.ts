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

    async findByName(name: string) {
        return this.userModel.findOne({ name }).exec();
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async create(data: CreateUserDto) {
        return this.userModel.create(data);
    }
}