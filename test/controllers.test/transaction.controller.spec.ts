import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../src/products/infrastructure/controllers/transaction.controller';
import { TransactionService } from '../../src/products/application/transaction.service';
import { RequestTransactionDTO } from '../../src/products/infrastructure/dto/request.transaction.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from 'src/products/infrastructure/repositories/user.repository';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    createTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    const dto: RequestTransactionDTO = { productId: '123', amount: 100 } as any;

    it('should call service and return result', async () => {
      const result = { id: 'tx1', ...dto };
      mockTransactionService.createTransaction.mockResolvedValue(result);
      await expect(controller.createTransaction(dto)).resolves.toEqual(result);
      expect(service.createTransaction).toHaveBeenCalledWith(dto);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockTransactionService.createTransaction.mockRejectedValue(new Error('fail'));
      await expect(controller.createTransaction(dto)).rejects.toThrow(InternalServerErrorException);
    });

    it('should log when creating transaction', async () => {
      const loggerSpy = jest.spyOn(controller['logger'], 'log');
      const result = { id: 'tx2', ...dto };
      mockTransactionService.createTransaction.mockResolvedValue(result);
      await controller.createTransaction(dto);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Received request to create transaction for product: ${dto.productId}`,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Transaction processed successfully: ${result.id}`,
      );
    });

    it('should log error when service throws', async () => {
      const loggerSpy = jest.spyOn(controller['logger'], 'error');
      mockTransactionService.createTransaction.mockRejectedValue(new Error('fail'));
      await expect(controller.createTransaction(dto)).rejects.toThrow(InternalServerErrorException);
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in TransactionController: fail'),
      );
    });

    it('should handle missing productId gracefully', async () => {
      const badDto: RequestTransactionDTO = { amount: 100 } as any;
      mockTransactionService.createTransaction.mockResolvedValue({ id: 'tx3', ...badDto });
      await expect(controller.createTransaction(badDto)).resolves.toHaveProperty('id', 'tx3');
      expect(service.createTransaction).toHaveBeenCalledWith(badDto);
    });

    
    });
});
