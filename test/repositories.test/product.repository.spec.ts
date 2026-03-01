import { ProductRepository } from '../../src/products/infrastructure/repositories/product.repository';
import { PrismaService } from 'src/prisma.service';
import { ProductDTO } from '../../src/products/infrastructure/dto/product.dto';

describe('ProductRepository', () => {
  let repo: ProductRepository;

  const mockPrisma = {
    products: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    repo = new ProductRepository(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should call prisma.products.findMany', () => {
      mockPrisma.products.findMany.mockReturnValue(['product1', 'product2']);
      const result = repo.getAllProducts();
      expect(result).toEqual(['product1', 'product2']);
      expect(mockPrisma.products.findMany).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should call prisma.products.create with data', async () => {
      const dto: ProductDTO = { name: 'Test' } as any;
      mockPrisma.products.create.mockResolvedValue({ ...dto, id: '1' });
      await expect(repo.createProduct(dto)).resolves.toEqual({ id: '1', name: 'Test' });
      expect(mockPrisma.products.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('updateProduct', () => {
    it('should call prisma.products.update with id and data', async () => {
      mockPrisma.products.update.mockResolvedValue({ id: '1', name: 'Updated' });
      const data = { name: 'Updated' };
      await expect(repo.updateProduct('1', data)).resolves.toEqual({ id: '1', name: 'Updated' });
      expect(mockPrisma.products.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({ name: 'Updated', updatedAt: expect.any(Date) }),
      });
    });
  });

  describe('decrementStock', () => {
    it('should call prisma.products.update with decrement', async () => {
      mockPrisma.products.update.mockResolvedValue({ id: '1', stock: 9 });
      await expect(repo.decrementStock('1', 1)).resolves.toEqual({ id: '1', stock: 9 });
      expect(mockPrisma.products.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { stock: { decrement: 1 } },
      });
    });
    it('should default quantity to 1', async () => {
      mockPrisma.products.update.mockResolvedValue({ id: '2', stock: 8 });
      await expect(repo.decrementStock('2')).resolves.toEqual({ id: '2', stock: 8 });
      expect(mockPrisma.products.update).toHaveBeenCalledWith({
        where: { id: '2' },
        data: { stock: { decrement: 1 } },
      });
    });
  });
});
