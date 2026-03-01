import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../src/products/application/transaction.service';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionAPI: any;
  let transactionRepository: any;
  let productRepository: any;

  const mockTransactionAPI = {
    getTokentransaction: jest.fn(),
    RegisterCardtransaction: jest.fn(),
    CompleteCardtransaction: jest.fn(),
    getTransactionbyId: jest.fn(),
  };

  const mockTransactionRepository = {
    createtransaction: jest.fn(),
    updateTransaction: jest.fn(),
  };

  const mockProductRepository = {
    decrementStock: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: 'TransactionAPIDomain', useValue: mockTransactionAPI },
        { provide: 'TransactionRepository', useValue: mockTransactionRepository },
        { provide: 'ProductRepository', useValue: mockProductRepository },
      ],
    }).compile();
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    const request = {
      productId: 'prod-1',
      productPrice: 100,
      // ...other fields as needed
    };

    it('should process transaction successfully', async () => {
      mockTransactionAPI.getTokentransaction.mockResolvedValue({ data: { presigned_acceptance: { acceptance_token: 'token123' } } });
      mockTransactionAPI.RegisterCardtransaction.mockResolvedValue({ data: { id: 'card123' } });
      mockTransactionRepository.createtransaction.mockResolvedValue({ id: 'localTx1' });
      mockTransactionAPI.CompleteCardtransaction.mockResolvedValue({ data: { id: 'gatewayTx1', status_message: 'Success' } });
      mockTransactionAPI.getTransactionbyId.mockResolvedValue({ data: { status: 'APPROVED' } });
      mockTransactionRepository.updateTransaction.mockResolvedValue({});
      mockProductRepository.decrementStock.mockResolvedValue({});

      const result = await service.createTransaction(request as any);
      expect(result).toEqual({
        id: 'gatewayTx1',
        status: 'APPROVED',
        status_message: 'Success',
      });
      expect(mockTransactionAPI.getTokentransaction).toHaveBeenCalled();
      expect(mockTransactionAPI.RegisterCardtransaction).toHaveBeenCalledWith(request);
      expect(mockTransactionRepository.createtransaction).toHaveBeenCalled();
      expect(mockTransactionAPI.CompleteCardtransaction).toHaveBeenCalled();
      expect(mockTransactionAPI.getTransactionbyId).toHaveBeenCalled();
      expect(mockTransactionRepository.updateTransaction).toHaveBeenCalled();
      expect(mockProductRepository.decrementStock).toHaveBeenCalledWith('prod-1', 1);
    });

    it('should not decrement stock if not approved', async () => {
      mockTransactionAPI.getTokentransaction.mockResolvedValue({ data: { presigned_acceptance: { acceptance_token: 'token123' } } });
      mockTransactionAPI.RegisterCardtransaction.mockResolvedValue({ data: { id: 'card123' } });
      mockTransactionRepository.createtransaction.mockResolvedValue({ id: 'localTx2' });
      mockTransactionAPI.CompleteCardtransaction.mockResolvedValue({ data: { id: 'gatewayTx2', status_message: 'Declined' } });
      mockTransactionAPI.getTransactionbyId.mockResolvedValue({ data: { status: 'DECLINED' } });
      mockTransactionRepository.updateTransaction.mockResolvedValue({});

      const result = await service.createTransaction(request as any);
      expect(result.status).toBe('DECLINED');
      expect(mockProductRepository.decrementStock).not.toHaveBeenCalled();
    });

    it('should throw error if any step fails', async () => {
      mockTransactionAPI.getTokentransaction.mockRejectedValue(new Error('fail'));
      await expect(service.createTransaction(request as any)).rejects.toThrow('fail');
    });
  });

  describe('private methods', () => {
    it('getAcceptanceToken should return token', async () => {
      mockTransactionAPI.getTokentransaction.mockResolvedValue({ data: { presigned_acceptance: { acceptance_token: 'tokenABC' } } });
      const token = await (service as any).getAcceptanceToken();
      expect(token).toBe('tokenABC');
    });
    it('registerCard should return card id', async () => {
      const req = { productId: 'prod-2' };
      mockTransactionAPI.RegisterCardtransaction.mockResolvedValue({ data: { id: 'cardXYZ' } });
      const cardId = await (service as any).registerCard(req);
      expect(cardId).toBe('cardXYZ');
    });
    it('saveInitialTransaction should call repo', async () => {
      const req = { productId: 'prod-3', productPrice: 50 };
      mockTransactionRepository.createtransaction.mockResolvedValue({ id: 'tx3' });
      const result = await (service as any).saveInitialTransaction(req, 'ref-3');
      expect(result).toEqual({ id: 'tx3' });
      expect(mockTransactionRepository.createtransaction).toHaveBeenCalled();
    });
    it('pollTransactionStatus should poll and return status', async () => {
      mockTransactionAPI.getTransactionbyId
        .mockResolvedValueOnce({ data: { status: 'PENDING' } })
        .mockResolvedValueOnce({ data: { status: 'APPROVED' } });
      const status = await (service as any).pollTransactionStatus('gwid-1');
      expect(status).toBe('APPROVED');
    }, 15000);
    it('finalizeTransaction should update and decrement stock if approved', async () => {
      mockTransactionRepository.updateTransaction.mockResolvedValue({});
      mockProductRepository.decrementStock.mockResolvedValue({});
      await (service as any).finalizeTransaction('localId', 'gwId', 'APPROVED', 'prod-4');
      expect(mockTransactionRepository.updateTransaction).toHaveBeenCalled();
      expect(mockProductRepository.decrementStock).toHaveBeenCalledWith('prod-4', 1);
    });
    it('finalizeTransaction should only update if not approved', async () => {
      mockTransactionRepository.updateTransaction.mockResolvedValue({});
      await (service as any).finalizeTransaction('localId', 'gwId', 'DECLINED', 'prod-5');
      expect(mockTransactionRepository.updateTransaction).toHaveBeenCalled();
      expect(mockProductRepository.decrementStock).not.toHaveBeenCalled();
    });
  });
});
