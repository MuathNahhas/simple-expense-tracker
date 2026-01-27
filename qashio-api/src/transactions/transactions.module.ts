import { Module } from '@nestjs/common';
import { TransactionsController } from './controller/transactions.controller';
import { TransactionsService } from './service/transactions.service';
import { TransactionsRepository } from './repository/transactions.repository';
import { DatabaseModule } from '../database/database.module';
import { CategoriesModule } from '../categories/categories.module';
import { RedisModule } from '../redis/redis.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [DatabaseModule, CategoriesModule, RedisModule, LoggerModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
