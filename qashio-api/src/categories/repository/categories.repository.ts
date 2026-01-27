import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { RedisService } from '../../redis/redis.service';
import { CACHE_TTL } from '../../common/constant';
@Injectable()
export class CategoriesRepository {
  private readonly tableName = 'categories';
  constructor(
    private readonly dbService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}
  private get repo() {
    return this.dbService.getRepository(this.tableName);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const transaction = this.repo.create({
      ...createCategoryDto,
    });
    return await this.repo.save(transaction);
  }
  async findOne(categoryId: string) {
    try {
      const cacheKey = `category:${categoryId}`;
      const cached = await this.redisService.getCache(cacheKey);
      if (cached) {
        return cached;
      } else {
        const result = await this.repo.findOneBy({ id: categoryId });
        if (result) {
          await this.redisService.setCache(cacheKey, result, CACHE_TTL.LONG);
        }
        return result;
      }
    } catch (error) {}
  }
}
