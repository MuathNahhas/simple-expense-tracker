import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { RedisService } from '../../redis/redis.service';
import { CACHE_TTL } from '../../common/constant';
import { LogService } from '../../logger/logger-service';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class CategoriesRepository {
  private readonly tableName = 'categories';
  constructor(
    private readonly dbService: DatabaseService,
    private readonly redisService: RedisService,
    private readonly logger: LogService,
  ) {}
  private get repo() {
    return this.dbService.getRepository(this.tableName);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const transaction = this.repo.create({
      ...createCategoryDto,
    });
    const cacheKey = `category:all`;
    const cached = await this.redisService.getCache(cacheKey);
    if (cached) {
      await this.redisService.removeCache(cacheKey);
      this.logger.log('remove cached categories', JSON.stringify(transaction));
    }
    this.logger.log('create category', JSON.stringify(transaction));
    return await this.repo.save(transaction);
  }
  async findOne(categoryId: string) {
    const cacheKey = `category:${categoryId}`;

    const cached = await this.redisService.getCache(cacheKey);
    if (cached) {
      this.logger.log(`Cache Hit: Category ${categoryId}`);
      return cached;
    }
    const result = await this.repo.findOneBy({ id: categoryId });

    if (!result) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
    await this.redisService.setCache(cacheKey, result, CACHE_TTL.LONG);

    return result;
  }

  async findAll() {
    const cacheKey = `category:all`;

    const cached = await this.redisService.getCache(cacheKey);
    if (cached) {
      this.logger.log(`Cache Hit: Category`);
      return plainToInstance(CategoryResponseDto, cached, {
        excludeExtraneousValues: true,
      });
    }
    const result = await this.repo.find();
    await this.redisService.setCache(cacheKey, result, CACHE_TTL.LONG);
    return plainToInstance(CategoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
