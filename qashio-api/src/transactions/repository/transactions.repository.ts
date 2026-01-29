import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { RedisService } from '../../redis/redis.service';
import {
  ALL_STATUS_TRANSACTION,
  ALL_TYPE_TRANSACTION,
  CACHE_TTL,
} from '../../common/constant';
import { LogService } from '../../logger/logger-service';
import { Brackets } from 'typeorm';

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
    const { search, type, status } = filters;

    if (search) {
      const amount = Number(search);
      const searchValue = `%${search}%`;

      query.andWhere(
        new Brackets((qb) => {
          qb.where('transaction.notes ILIKE :search', { search: searchValue })
            .orWhere('transaction.status ILIKE :search', {
              search: searchValue,
            })
            .orWhere('CAST(transaction.type AS TEXT) ILIKE :search', {
              search: searchValue,
            });
          if (!isNaN(amount)) {
            qb.orWhere('transaction.amount = :amount', { amount });
          }
        }),
      );
    }

    if (status && status !== ALL_STATUS_TRANSACTION) {
      query.andWhere('transaction.status = :status', { status });
    }

    if (type && type !== ALL_TYPE_TRANSACTION) {
      query.andWhere('transaction.type = :type', { type });
    }

    return query;
  }
  async findAllWithFilters(skip: number, limit: number, filters: any) {
    const query = this.repo.createQueryBuilder('transaction');
    query.leftJoinAndSelect('transaction.category', 'category');

    if (filters.search) {
      const amount = Number(filters.search);
      const search = `%${filters.search}%`;

      query.andWhere(
        new Brackets((qb) => {
          qb.where('transaction.notes ILIKE :search', { search })
            .orWhere('transaction.status ILIKE :search', { search })
            .orWhere('category.name ILIKE :search', { search })
            .orWhere('CAST(transaction.type AS TEXT) ILIKE :search', {
              search,
            });
          if (!isNaN(amount)) {
            qb.orWhere('transaction.amount = :amount', { amount });
          }
        }),
      );
    }
    if (
      filters.type &&
      filters.type !== ALL_TYPE_TRANSACTION &&
      filters.type !== ''
    ) {
      query.andWhere('transaction.type = :type', {
        type: filters.type.toLowerCase(),
      });
    }
    if (
      filters.status &&
      filters.status !== ALL_STATUS_TRANSACTION &&
      filters.status !== ''
    ) {
      query.andWhere('transaction.status = :status', {
        status: filters.status,
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
      ...(updateTransactionDto.categoryId && {
        category: { id: updateTransactionDto.categoryId },
      }),
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
