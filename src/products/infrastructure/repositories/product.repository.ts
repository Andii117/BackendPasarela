import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDTO } from '../dto/product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllProducts() {
    return this.prisma.products.findMany();
  }

  createProduct(product: ProductDTO) {
    return this.prisma.products.create({
      data: product,
    });
  }
}
