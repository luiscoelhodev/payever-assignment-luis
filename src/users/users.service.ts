import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import { downloadAndSaveAvatar } from '../helpers/downloadAndSaveAvatar';
import * as path from 'path';
import { RabbitService } from '../rabbit/rabbitmq.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private httpService: HttpService,
    private readonly rabbitService: RabbitService,
    private readonly mailerService: MailerService,
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
    await createdUser.save();

    // Send RabbitMQ message
    await this.rabbitService.sendMessage({ userId: createdUser.id });

    // Send email
    await this.mailerService.sendMail({
      to: createdUser.email,
      subject: 'Welcome to our app!',
      //template: './welcome',
      context: { name: createdUser.first_name },
    });

    return createdUser;
  }

  async findOneUserFromExternalApi(userId: number): Promise<User> {
    const axiosRequest = this.httpService.get(
      `https://reqres.in/api/users/${userId}`,
    );
    const axiosResponse = await lastValueFrom(axiosRequest);
    const userFound = axiosResponse.data.data;

    return userFound;
  }

  async getUserAvatar(userId: number) {
    const userFound = await this.userModel.findOne({ id: userId });
    let avatar = userFound.avatar;

    if (avatar.startsWith('http')) {
      const avatarHash = await downloadAndSaveAvatar(avatar);
      avatar = avatarHash;

      await this.userModel.findByIdAndUpdate(userFound._id, {
        $set: { avatar },
      });
    }

    const avatarPath = `${process.cwd()}/src/avatars/${avatar}`;
    const avatarBuffer = fs.readFileSync(avatarPath);
    const base64Avatar = Buffer.from(avatarBuffer).toString('base64');
    return base64Avatar;
  }

  async deleteUserAvatar(userId: number): Promise<void> {
    const user = await this.userModel.findOne({ id: userId });
    if (!user || !user.avatar) {
      throw new NotFoundException(
        `User with id ${userId} not found or has no avatar`,
      );
    }
    const avatarPath = path.resolve(process.cwd(), 'src/avatars', user.avatar);
    await fs.promises.unlink(avatarPath);

    user.avatar = '';
    await user.save();
  }
}
