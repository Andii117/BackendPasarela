import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { ProductService } from '../../application/product.service';
import { ProductDTO } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('getAllProducts')
  async getAllProducts() {
    const product = await this.productService.getAllProducts();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Post('createProducts')
  async createProducts(@Body() product: ProductDTO) {
    return this.productService.createProduct(product);
  }
}
