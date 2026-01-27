import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionsRepository {
  private readonly tableName = 'transactions';
  constructor(private readonly dbService: DatabaseService) {}

  private get repo() {
    return this.dbService.getRepository(this.tableName);
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
    return await this.repo.findOneBy({ id: transactionId });
  }
  async findAll() {
    return await this.repo.find();
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
    return this.findOne(updatedTransaction.id);
  }

  async remove(id: string) {
    const transaction = await this.repo.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return await this.repo.softRemove(transaction);
  }
}
