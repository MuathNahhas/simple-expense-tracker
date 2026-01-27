import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClient } from './redis.client';

@Module({
  providers: [RedisService, RedisClient],
})
export class RedisModule {}
