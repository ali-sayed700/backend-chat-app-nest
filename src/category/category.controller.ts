import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  getCategory() {
    return this.categoryService.getCategory();
  }

  @Post()
  createCategory(@Body() body) {
    return this.categoryService.createCategory(body);
  }
}
