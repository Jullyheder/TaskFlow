import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDao } from './users.dao';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  constructor(
    private readonly usersDao: UsersDao,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.usersDao.findByEmail(createUserDto.email);

    if (userExists) {
      throw new Error('User with this email already exists');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, this.saltRounds);

    return this.usersDao.create(createUserDto);
  }

  findAll() {
    return this.usersDao.findAll();
  }

  findOne(name: string) {
    return this.usersDao.findByName(name.toString());
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
