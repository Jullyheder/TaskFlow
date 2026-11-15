import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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
      throw new ConflictException('User with this email already exists');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, this.saltRounds);

    return this.usersDao.create(createUserDto);
  }

  findAll() {
    return this.usersDao.findAll();
  }

  findOne(id: string) {
    return this.usersDao.findById(id.toString());
  }

  findByEmail(email: string) {
    return this.usersDao.findByEmail(email);
  }

  findByEmailWithPassword(email: string) {
    return this.usersDao.findByEmailWithPassword(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersDao.findById(id.toString());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }

    return this.usersDao.update(id.toString(), updateUserDto);
  }

  async remove(id: string) {
    const user = await this.usersDao.findById(id.toString());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersDao.delete(id.toString());
  }
}
