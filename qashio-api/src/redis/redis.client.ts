import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisClient {
  public client: Redis;

  constructor(private configService: ConfigService) {
    const config = this.configService.get('redis');
    this.client = new Redis({
      host: config.host,
      port: Number(config.port),
      username: config.username,
      password: config.password,
      db: config.db,
      family: Number(config.family),
      retryStrategy: (times) => {
        if (times > 5) return null;
        return 2000;
      },
    });
    this.client.on('connect', () => console.log('✅ Connected to Redis!'));
    this.client.on('error', (err) => console.error('❌ Redis error', err));
  }
  get clientFunction() {
    return this.client;
  }
}
