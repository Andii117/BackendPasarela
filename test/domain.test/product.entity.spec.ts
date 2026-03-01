import { Product } from '../../src/products/domain/product.entity';

describe('Product', () => {
  it('should create a product with correct properties', () => {
    const product = new Product('1', 'Test Product', 99.99);
    expect(product.id).toBe('1');
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(99.99);
  });

  it('should have readonly properties', () => {
    const product = new Product('2', 'ReadOnly', 10);
    expect(() => {
      // @ts-expect-error
      product.id = '3';
    }).toThrow();
    expect(() => {
      // @ts-expect-error
      product.name = 'Changed'; 
    }).toThrow();
    expect(() => {
      // @ts-expect-error
      product.price = 20;
    }).toThrow();
  });
});
