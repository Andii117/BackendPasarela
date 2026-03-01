import { TransactionRepository } from '../../src/products/infrastructure/repositories/transaction.repository';
import { PrismaService } from 'src/prisma.service';
import { TransactionDTO } from '../../src/products/infrastructure/dto/transaction.dto';

describe('TransactionRepository', () => {
  let repo: TransactionRepository;

  const mockPrisma = {
    transactions: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    repo = new TransactionRepository(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('createtransaction', () => {
    it('should call prisma.transactions.create with data', async () => {
      const dto: TransactionDTO = { id: 'tx1' } as any;
      mockPrisma.transactions.create.mockResolvedValue({ id: 'tx1' });
      await expect(repo.createtransaction(dto)).resolves.toEqual({ id: 'tx1' });
      expect(mockPrisma.transactions.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('updateTransaction', () => {
    it('should call prisma.transactions.update with id and data', async () => {
      mockPrisma.transactions.update.mockResolvedValue({ id: 'tx2', status: 'APPROVED' });
      const data = {
        status: 'APPROVED',
        external_transaction_id: 'ext2',
        last_response: 'OK',
      };
      await expect(repo.updateTransaction('tx2', data)).resolves.toEqual({ id: 'tx2', status: 'APPROVED' });
      expect(mockPrisma.transactions.update).toHaveBeenCalledWith({
        where: { id: 'tx2' },
        data: expect.objectContaining({
          status: 'APPROVED',
          external_transaction_id: 'ext2',
          last_response: 'OK',
          updatedAt: expect.any(Date),
        }),
      });
    });
  });
});
