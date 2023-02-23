import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RabbitService } from './rabbit/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Initialize RabbitMQ service
  const rabbitService = app.get(RabbitService);
  await rabbitService.init();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
