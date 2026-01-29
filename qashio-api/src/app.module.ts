import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from './redis/redis.module';
import redisConfig from './config/redis.config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import Redis from 'ioredis';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      load: [databaseConfig, redisConfig],
      cache: true,
    }),
    DatabaseModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 10000,
            limit: 30,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: config.get('DEV_REDIS_HOST'),
            port: config.get<number>('DEV_REDIS_PORT'),
            family: Number(config.get<number>('DEV_REDIS_FAMILY')),
            db: config.get('DEV_REDIS_DATABASE'),
            password: config.get('DEV_REDIS_PASSWORD'),
            username: config.get('DEV_REDIS_USERNAME'),
          }),
        ),
      }),
    }),
    RedisModule,
    TransactionsModule,
    CategoriesModule,
    LoggerModule,
    UsersModule,
    AuthenticationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
