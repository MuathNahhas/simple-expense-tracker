import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repository/categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoriesRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }
  findOne(categoryId: string) {
    return this.categoryRepository.findOne(categoryId);
  }

  findAll() {
    return this.categoryRepository.findAll();
  }
}
