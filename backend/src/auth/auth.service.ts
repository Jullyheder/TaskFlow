import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();

    const userExists = await this.usersService.findByEmail(email);

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    dto.password = await bcrypt.hash(dto.password, this.saltRounds);

    const user = await this.usersService.create({
      name: dto.name,
      email,
      password: dto.password,
    });

    if (!user) {
      throw new BadRequestException('Failed to create user');
    }

    return {
      'id': user._id,
      'name': user.name,
      'email': user.email,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user._id,
    });

    return {
      'access_token': accessToken,
    };
  }

  async profile(userId: string) {
    const user = await this.usersService.findOne(userId);


    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      'id': user._id,
      'name': user.name,
      'email': user.email,
    };
  }
}