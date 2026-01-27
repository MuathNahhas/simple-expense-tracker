import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.DEV_REDIS_HOST,
  port: Number(process.env.DEV_REDIS_PORT),
  username: process.env.DEV_REDIS_USERNAME,
  password: process.env.DEV_REDIS_PASSWORD,
  db: Number(process.env.DEV_REDIS_DATABASE),
  family: Number(process.env.DEV_REDIS_FAMILY),
}));
