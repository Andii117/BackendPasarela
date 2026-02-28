import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import type { ProductRepository } from '../infrastructure/repositories/product.repository';
import { ProductDTO } from '../infrastructure/dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepository') private readonly productRepo: ProductRepository,
  ) {}

  async getAllMockProducts() {
    return this.productRepo.getAllMockProducts();
  }

  async createProduct(product: ProductDTO) {
    return this.productRepo.createProduct(product);
  }

  
}
