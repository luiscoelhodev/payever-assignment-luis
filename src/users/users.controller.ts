import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { ValidationExceptionFilter } from '../common/validation-exception.filter';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/users') // #1
  @UseFilters(new ValidationExceptionFilter())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/user/:userId') // #2
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOneUserFromExternalApi(+userId);
  }

  @Get('/user/:userId/avatar') // #3
  async getUserAvatar(@Param('userId') userId: string, @Res() res: Response) {
    const base64Avatar = await this.usersService.getUserAvatar(+userId);
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(Buffer.from(base64Avatar, 'base64'));
  }

  @Delete('/user/:userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    this.usersService.deleteUserAvatar(+userId);
    return { message: 'User avatar deleted successfully!' };
  }
}
