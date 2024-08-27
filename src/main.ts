import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      bufferLogs: true,
      transport: Transport.RMQ,
      options: {
        queue: 'products',
        urls: [envs.RABBITMQ_SERVER],
        noAck: false,
        queueOptions: {
          durable: true,
          autoDelete: false,
        },
      },
    },
  );

  app.useLogger(app.get(PinoLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();

  const logger = new Logger('Bootstrap');

  logger.log(`Products MS is running on ${envs.port}`);
}
bootstrap();
