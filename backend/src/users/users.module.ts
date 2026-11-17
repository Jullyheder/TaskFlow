import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersDao } from './users.dao';

import { User, UserSchema } from './schemas/user.schema';

import { AuthJwtModule } from '../auth/auth-jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ]),

    AuthJwtModule,
  ],

  controllers: [UsersController],

  providers: [
    UsersService,
    UsersDao,
  ],
  
  exports:[UsersService],
})
export class UsersModule {}
