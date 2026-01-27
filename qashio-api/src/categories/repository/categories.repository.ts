import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
@Injectable()
export class CategoriesRepository {
  private readonly tableName = 'categories';
  constructor(private readonly dbService: DatabaseService) {}
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
    return await this.repo.findOneBy({ id: categoryId });
  }
}
