import {
  Body, Controller, Get, HttpCode,
  HttpStatus, Post, Req, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @Req() req: Request & { user: { sub: string } },
  ) {
    return this.authService.profile(req.user.sub);
  }
}