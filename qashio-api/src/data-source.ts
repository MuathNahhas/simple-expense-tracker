import { DataSource } from 'typeorm';
import { entities } from './entities';
import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
const envFilePath = path.join(__dirname, `../.env.${env}`);
dotenv.config({ path: envFilePath });
console.log(`Running Migrations in [${env}] mode`);
console.log(`Loading config from: ${envFilePath}`);
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: entities,
  migrations: ['src/migrations/*.ts'],
});
