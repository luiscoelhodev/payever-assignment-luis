import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User, UserSchema } from '../src/users/user.schema';
import axios from 'axios';
// import { response } from 'express';

describe('UsersController (Integration tests with all endpoints)', () => {
  let app: INestApplication;

  // const userData = { email: 'test@example.com', password: 'password' };
  // let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot('mongodb://mongo:27017/test_db', {
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. POST /api/users', () => {
    it('should throw a validation error if a required parameter is missing', async () => {
      const requestBody = {
        first_name: 'John',
        last_name: 'Doe',
      };

      const axiosInstance = axios.create();
      try {
        const response = await axiosInstance.post(
          'http://localhost:3000/api/users',
          requestBody,
        );
        console.log(response);
        expect(response.status).toEqual(400);
      } catch (error) {
        console.log(error.response.data);
        throw error;
      }
    });
  });

  // it('should create a user', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/users')
  //     .send(userData)
  //     .expect(201);

  //   createdUserId = response.body.id;
  //   expect(createdUserId).toBeDefined();
  // });

  // it('should get all users', async () => {
  //   const response = await request(app.getHttpServer()).get('/users');
  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBeGreaterThan(0);
  // });

  // it('should get a single user by ID', async () => {
  //   const response = await request(app.getHttpServer()).get(
  //     `/users/${createdUserId}`,
  //   );
  //   expect(response.status).toBe(200);
  //   expect(response.body.email).toBe(userData.email);
  // });

  // it('should update a user', async () => {
  //   const updatedUserData = {
  //     email: 'updated@example.com',
  //     password: 'newpassword',
  //   };

  //   const response = await request(app.getHttpServer())
  //     .patch(`/users/${createdUserId}`)
  //     .send(updatedUserData)
  //     .expect(200);

  //   expect(response.body.email).toBe(updatedUserData.email);
  // });

  // it('should delete a user', async () => {
  //   await request(app.getHttpServer())
  //     .delete(`/users/${createdUserId}`)
  //     .expect(200);
  //   const response = await request(app.getHttpServer()).get(
  //     `/users/${createdUserId}`,
  //   );
  //   expect(response.status).toBe(404);
  // });
});
