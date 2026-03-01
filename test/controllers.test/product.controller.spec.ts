import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../src/products/infrastructure/controllers/product.controller';
import { ProductService } from '../../src/products/application/product.service';
import { ProductDTO } from '../../src/products/infrastructure/dto/product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    getAllProducts: jest.fn(),
    createProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return products from service', async () => {
      const products = [{ id: '1', name: 'Test' }];
      mockProductService.getAllProducts.mockResolvedValue(products);
      await expect(controller.getAllProducts()).resolves.toEqual(products);
      expect(service.getAllProducts).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no products', async () => {
      mockProductService.getAllProducts.mockResolvedValue(null);
      await expect(controller.getAllProducts()).rejects.toThrow(NotFoundException);
    });
  });

  describe('createProducts', () => {
    it('should call service and return result', async () => {
      const dto: ProductDTO = { name: 'New Product' } as any;
      const result = { ...dto, id: '2' };
      mockProductService.createProduct.mockResolvedValue(result);
      await expect(controller.createProducts(dto)).resolves.toEqual(result);
      expect(service.createProduct).toHaveBeenCalledWith(dto);
    });
  });
});
