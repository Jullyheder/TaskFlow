import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthJwtModule } from './auth-jwt.module';
import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthJwtModule,
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
