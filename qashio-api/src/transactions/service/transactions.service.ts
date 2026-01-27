import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from '../repository/transactions.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { CategoriesService } from '../../categories/service/categories.service';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

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

  findAll() {
    return this.transactionRepository.findAll();
  }

  async update(id: string, updateDto: UpdateTransactionDto) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    return this.transactionRepository.remove(id);
  }
}
