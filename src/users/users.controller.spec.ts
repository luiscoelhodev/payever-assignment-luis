import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import mongoose from 'mongoose';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((createUserDto) => {
      return {
        id: Math.floor(Math.random() * 10) + 1,
        _id: new mongoose.Types.ObjectId().toString(),
        __v: 0,
        ...createUserDto,
      };
    }),
    findOneUserFromExternalApi: jest.fn((userId: number) => {
      return {
        id: userId,
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'http://',
      };
    }),
    getUserAvatar: jest.fn(() => {
      return Buffer.from('generate-a-base64-string').toString('base64');
    }),
    deleteUserAvatar: jest.fn((userId: number) => {
      return {
        id: userId,
        _id: new mongoose.Types.ObjectId().toString(),
        __v: 0,
        first_name: 'Deleted',
        last_name: 'User',
        email: 'goodbye@email.com',
        avatar: 'http://',
      };
    }),
    getAllUsers: jest.fn(() => {
      return [
        {
          id: 1,
          _id: new mongoose.Types.ObjectId().toString(),
          __v: 0,
          first_name: 'First',
          last_name: 'User',
          email: 'first@email.com',
          avatar: 'http://',
        },
        {
          id: 2,
          _id: new mongoose.Types.ObjectId().toString(),
          __v: 0,
          first_name: 'Second',
          last_name: 'User',
          email: 'second@email.com',
          avatar: 'http://',
        },
      ];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const newUser: CreateUserDto = {
      first_name: 'Luis',
      last_name: 'Coelho',
      email: 'luis@email.com',
      avatar: 'http://www.myavatar.com',
    };
    expect(controller.create(newUser)).toEqual({
      id: expect.any(Number),
      _id: expect.any(String),
      __v: expect.any(Number),
      ...newUser,
    });
  });

  it('should retrieve a user', () => {
    expect(controller.findOne('1')).toEqual({
      id: expect.any(Number),
      email: expect.any(String),
      first_name: expect.any(String),
      last_name: expect.any(String),
      avatar: expect.any(String),
    });
  });

  it('should return a base64 encoded string, set the Content-Type header and send the base64 avatar as a buffer', async () => {
    const response = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };
    const base64Avatar = mockUsersService.getUserAvatar();

    expect(await controller.getUserAvatar('1', response as any)).toEqual(
      expect.any(String),
    );
    expect(response.send).toHaveBeenCalledWith(
      Buffer.from(base64Avatar, 'base64'),
    );
    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'image/jpeg',
    );
  });

  it('should return success message from deletion', async () => {
    expect(await controller.deleteUserAvatar('1')).toEqual({
      message: 'User avatar deleted successfully!',
    });
  });

  it('should return all users in database', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: expect.any(Number),
        _id: expect.any(String),
        __v: expect.any(Number),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        avatar: expect.any(String),
      },
      {
        id: expect.any(Number),
        _id: expect.any(String),
        __v: expect.any(Number),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        avatar: expect.any(String),
      },
    ]);
  });
});
