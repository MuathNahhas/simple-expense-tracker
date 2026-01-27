import { Injectable } from '@nestjs/common';
import { RedisClient } from './redis.client';

@Injectable()
export class RedisService {
  constructor(private readonly redisClient: RedisClient) {}
  async setCache(key, value, ttlSeconds?) {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redisClient.clientFunction.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.redisClient.clientFunction.set(key, data);
    }
  }
  async getCache<T>(key: string) {
    const data = await this.redisClient.clientFunction.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }
  async removeCache(key: string) {
    await this.redisClient.clientFunction.del(key);
  }
}
