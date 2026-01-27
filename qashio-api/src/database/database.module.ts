import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { entities } from '../entities';

const logger = new Logger('DatabaseConfig');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const dbName = configService.get<string>('DB_NAME');

        logger.log(`Attempting to connect to DB: ${dbName} on host: ${host}`);

        return {
          type: 'postgres',
          host: host,
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: dbName,
          synchronize: false,
          entities: entities,
          migrations: [__dirname + '/../migrations/*{.ts,.js}'],
          migrationsRun: false,
          logging: ['error', 'warn'],
          retryAttempts: process.env.NODE_ENV === 'production' ? 10 : 3,
          retryDelay: process.env.NODE_ENV === 'production' ? 5000 : 3000,
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
