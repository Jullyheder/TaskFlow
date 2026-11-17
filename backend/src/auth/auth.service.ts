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
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    dto.email = dto.email.toLowerCase();

    const user = await this.usersService.create(dto);

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

    const payload: JwtPayload = {
      sub: user._id.toString(),
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

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