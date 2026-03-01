import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../src/products/application/product.service';
import { ProductDTO } from '../../src/products/infrastructure/dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: any;

  const mockProductRepo = {
    getAllProducts: jest.fn(),
    createProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: 'ProductRepository', useValue: mockProductRepo },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get('ProductRepository');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return products from repo', async () => {
      const products = [{ id: '1', name: 'Test' }];
      mockProductRepo.getAllProducts.mockResolvedValue(products);
      await expect(service.getAllProducts()).resolves.toEqual(products);
      expect(productRepo.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should call repo and return result', async () => {
      const dto: ProductDTO = { name: 'New Product' } as any;
      const result = {  ...dto, id: '2', };
      mockProductRepo.createProduct.mockResolvedValue(result);
      await expect(service.createProduct(dto)).resolves.toEqual(result);
      expect(productRepo.createProduct).toHaveBeenCalledWith(dto);
    });
  });
});
