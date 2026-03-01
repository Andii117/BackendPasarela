import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDTO } from '../dto/product.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllProducts() {
    return this.prisma.products.findMany();
  }

  async createProduct(product: ProductDTO) {
    return await this.prisma.products.create({
      data: product,
    });
  }

  async updateProduct(id: string, data: any) {
    return this.prisma.products.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async decrementStock(id: string, quantity: number = 1) {
    return this.prisma.products.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}
