import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { HttpModule } from '@nestjs/axios';
import { RabbitService } from '../rabbit/rabbitmq.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RabbitService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    HttpModule,
  ],
})
export class UsersModule {}
