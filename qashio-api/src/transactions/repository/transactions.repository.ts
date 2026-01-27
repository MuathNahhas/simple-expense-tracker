import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { RedisService } from '../../redis/redis.service';
import { CACHE_TTL } from '../../common/constant';

@Injectable()
export class TransactionsRepository {
  private readonly tableName = 'transactions';
  constructor(
    private readonly dbService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  private get repo() {
    return this.dbService.getRepository(this.tableName);
  }

  public async getTransactionCount() {
    return await this.repo.count();
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.repo.create({
      ...createTransactionDto,
      category: { id: createTransactionDto.categoryId },
    });
    const newTransaction = await this.repo.save(transaction);
    return this.findOne(newTransaction.id);
  }

  async findOne(transactionId: string) {
    try {
      const cacheKey = `transaction:${transactionId}`;
      const cached = await this.redisService.getCache(cacheKey);
      if (cached) {
        return cached;
      } else {
        const result = await this.repo.findOneBy({ id: transactionId });
        if (result) {
          await this.redisService.setCache(cacheKey, result, CACHE_TTL.LONG);
        }
        return result;
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
  async findAll(skip: number, limit: number) {
    return this.repo.find({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.repo.preload({
      id,
      ...updateTransactionDto,
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    const updatedTransaction = await this.repo.save(transaction);
    const cacheKey = `transaction:${id}`;
    await this.redisService.removeCache(cacheKey);
    return this.findOne(updatedTransaction.id);
  }
  async remove(id: string) {
    const cacheKey = `transaction:${id}`;
    const transaction = await this.repo.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    const removedTransaction = await this.repo.softRemove(transaction);
    await this.redisService.removeCache(cacheKey);
    return removedTransaction;
  }
}
