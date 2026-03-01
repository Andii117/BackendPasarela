import { Product } from './product.entity';

export interface ProductRepository {
  decrementStock(productId: string, arg1: number): unknown;
  findById(id: string): Promise<Product | null>;
}
