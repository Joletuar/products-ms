import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from 'nestjs-pino';

import { redisStore } from 'cache-manager-redis-yet';

import { ProductsModule } from './products/products.module';
import { envs } from './config';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  messageKey: 'message',
                  colorize: true,
                },
              }
            : undefined,
        messageKey: 'message',
      },
    }),
    ProductsModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: envs.REDIS_HOST,
            port: envs.REDIS_PORT,
          },
        }),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
