import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const howManyDocumentsInCollection = (await this.userModel.find()).length;
    const createdUser = new this.userModel({
      id: howManyDocumentsInCollection + 1,
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      avatar: createUserDto.avatar,
    });
    return createdUser.save();
  }

  async findOneUserFromExternalApi(userId: number): Promise<User> {
    const axiosRequest = this.httpService.get(
      `https://reqres.in/api/users/${userId}`,
    );
    const axiosResponse = await lastValueFrom(axiosRequest);
    const userFound = axiosResponse.data.data;

    return userFound;
  }

  async getUserAvatar(userId: string): Promise<User[]> {
    return this.userModel.find().exec();
  }
  // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  //   return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  // }

  // async remove(id: string): Promise<User> {
  //   return this.userModel.findByIdAndRemove(id);
  // }
}
