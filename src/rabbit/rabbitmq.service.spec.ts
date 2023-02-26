import { Test, TestingModule } from '@nestjs/testing';
import { RabbitService } from './rabbitmq.service';
import * as amqp from 'amqplib';
import 'dotenv/config';

describe('RabbitService', () => {
  process.env.TEST_ENV = 'true';
  let service: RabbitService;
  let connection: amqp.Connection;
  let channel: amqp.Channel;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitService],
    }).compile();

    service = module.get<RabbitService>(RabbitService);

    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange('user_created', 'fanout');
    await channel.assertQueue('user_created_queue');
  });

  // afterAll(async () => {
  //   await channel.close();
  //   await connection.close();
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init', () => {
    it('should connect to RabbitMQ successfully', async () => {
      await service.init();
      expect(connection).toBeDefined();
    });

    it('should create a channel and assert an exchange', async () => {
      await service.init();
      expect(channel).toBeDefined();
      const assertExchangeResult = await channel.checkExchange('user_created');
      expect(assertExchangeResult).toBeDefined();
    });
  });

  describe('sendMessage', () => {
    it('should publish a message to the "user_created" exchange', async () => {
      const message = { id: 1, name: 'Luis Coelho' };
      const spy = jest.spyOn(service, 'sendMessage');
      await service.sendMessage(message);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(message);
    });
  });
});
