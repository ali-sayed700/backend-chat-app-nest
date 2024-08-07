import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from 'src/category/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async getProd() {
    return await this.productRepository.find({
      relations: { category: true },
    });
  }
  //   return await this.productRepository.find();
  // }

  async createProd(prod) {
    const category = await Promise.all(
      prod.category.map((x) => this.preloadCourseByName(x)),
    );
    const room = this.productRepository.create({
      product: prod.product,
      category,
    });
    await this.productRepository.save(room);
    return {
      statusCode: '201',
      message: 'Channel created successfully.',
      room,
    };
  }

  // async addBooksToAuthor(authorId, bookIds): Promise<Product> {
  //   const prod = await this.productRepository.findOne({
  //     where: { id: authorId },
  //     relations: ['category'],
  //   });
  //   const category = await this.categoryRepository.findBy(bookIds);
  //   prod.category = category;
  //   return this.productRepository.save(prod);
  // }

  private async preloadCourseByName(name: string): Promise<Category> {
    const course = await this.categoryRepository.findOne({
      where: { id: name },
    });
    if (course) {
      return course;
    }
    return this.categoryRepository.create({ id: name });
  }
}

// async addGroupToUser(categoryId: number, productId: number[]): Promise<User> {
//   const user = await this.userRepository.findOne({
//     where: { id: userId },
//     relations: ['category'],
//   });
//   const groups = await this.groupRepository.findByIds(groupIds);
//   user.groups = groups;
//   return this.userRepository.save(user);
// }
