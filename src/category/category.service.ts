import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategory() {
    return await this.categoryRepository.find();
  }

  async createCategory(prod) {
    const category = this.categoryRepository.create(prod);
    await this.categoryRepository.save(category);
    return {
      statusCode: '201',
      message: 'Channel created successfully.',
      category,
    };
  }
}
