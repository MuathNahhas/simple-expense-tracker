import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from '../repository/transactions.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { CategoriesService } from '../../categories/service/categories.service';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionsRepository,
    private readonly categoryService: CategoriesService,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.transactionRepository.create(createTransactionDto);
  }

  async findOne(transactionId: string) {
    const transaction = await this.transactionRepository.findOne(transactionId);
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }
    return transaction;
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.transactionRepository.findAll(skip, limit),
      this.getTransactionCount(),
    ]);
    return {
      data,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }
  async update(id: string, updateDto: UpdateTransactionDto) {
    const { categoryId, ...rest } = updateDto;
    const updateData: UpdateTransactionDto = { ...rest };
    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      if (!category) {
        throw new NotFoundException(`Category ${categoryId} not found`);
      }
      updateData.categoryId = categoryId;
    }
    const updated = await this.transactionRepository.update(id, updateData);
    return updated;
  }

  async remove(id: string) {
    return this.transactionRepository.remove(id);
  }

  async getTransactionCount() {
    return await this.transactionRepository.getTransactionCount();
  }
}
