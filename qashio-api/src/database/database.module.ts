import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
          synchronize: true,
          autoLoadEntities: true,
          logging: ['error', 'warn'],
          retryAttempts: process.env.NODE_ENV === 'production' ? 10 : 3,
          retryDelay: process.env.NODE_ENV === 'production' ? 5000 : 3000,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
