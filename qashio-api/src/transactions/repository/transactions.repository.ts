import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { RedisService } from '../../redis/redis.service';
import { CACHE_TTL } from '../../common/constant';
import { LogService } from '../../logger/logger-service';
import { TransactionType } from '../enum/transaction-type.enum';

@Injectable()
export class TransactionsRepository {
  private readonly tableName = 'transactions';
  constructor(
    private readonly dbService: DatabaseService,
    private readonly redisService: RedisService,
    protected readonly logger: LogService,
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
    this.logger.log(
      `create transaction with id:${newTransaction.id}`,
      JSON.stringify(newTransaction),
    );
    return this.findOne(newTransaction.id);
  }

  async findOne(transactionId: string) {
    const cacheKey = `transaction:${transactionId}`;

    const cached = await this.redisService.getCache(cacheKey);
    if (cached) return cached;
    const result = await this.repo.findOneBy({ id: transactionId });
    if (!result) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }
    await this.redisService.setCache(cacheKey, result, CACHE_TTL.LONG);
    return result;
  }
  private applyTransactionFilters(query: any, filters: any) {
    const { search, type } = filters;
    if (search) {
      const amount = Number(filters.search);
      if (!isNaN(amount)) {
        query.andWhere('transaction.amount = :amount', { amount });
      }
      query.andWhere(
        '(transaction.notes ILIKE :search OR CAST(transaction.type AS TEXT) ILIKE :search )',
        { search: `%${search}%` },
      );
    }
    if (type && type !== TransactionType.ALL_TYPE) {
      query.andWhere('transaction.type = :type', { type });
    }
    return query;
  }
  async findAllWithFilters(skip: number, limit: number, filters: any) {
    const query = this.repo.createQueryBuilder('transaction');
    query.leftJoinAndSelect('transaction.category', 'category');
    if (filters.search) {
      const amount = Number(filters.search);
      if (!isNaN(amount)) {
        query.andWhere('transaction.amount = :amount', { amount });
      }
      query.andWhere(
        '(transaction.notes ILIKE :search OR category.name ILIKE :search OR CAST(transaction.type AS TEXT) ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (
      filters.type &&
      filters.type !== TransactionType.ALL_TYPE &&
      filters.type !== ''
    ) {
      query.andWhere('transaction.type = :type', {
        type: filters.type.toLowerCase(),
      });
    }
    return await query
      .orderBy('transaction.date', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();
  }
  async countWithFilters(filters: any): Promise<number> {
    try {
      const query = this.repo.createQueryBuilder('transaction');
      this.applyTransactionFilters(query, filters);
      return await query.getCount();
    } catch (error) {
      this.logger.error(`Error counting transactions: ${error.message}`);
      throw error;
    }
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
    this.logger.log(`Transaction ${id} updated in database`);
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
