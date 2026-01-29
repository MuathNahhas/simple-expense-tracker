import { Module } from '@nestjs/common';
import { CategoriesController } from './controller/categories.controller';
import { CategoriesService } from './service/categories.service';
import { CategoriesRepository } from './repository/categories.repository';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';
import { LoggerModule } from '../logger/logger.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, RedisModule, LoggerModule, JwtModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
