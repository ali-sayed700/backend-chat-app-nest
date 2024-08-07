import {
  Body,
  Controller,
  Get,
  // Param,
  // ParseIntPipe,
  // Param,
  // ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProd() {
    return this.productService.getProd();
  }

  @Post()
  createProd(@Body() body) {
    return this.productService.createProd(body);
  }

  // @Post(':id/category')
  // async addBooksToAuthor(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body() bookIds: string[],
  // ) {
  //   return this.productService.addBooksToAuthor(id, bookIds);
  // }
}
