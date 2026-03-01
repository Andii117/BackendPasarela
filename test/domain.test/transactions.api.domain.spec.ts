import { Test, TestingModule } from '@nestjs/testing';
import { TransactionAPIDomain } from '../../src/products/domain/transactions.api.domain';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { RequestTransactionDTO } from 'src/products/infrastructure/dto/request.transaction.dto';

describe('TransactionAPIDomain', () => {
  let service: TransactionAPIDomain;
  let httpService: any;

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

   const mockRequestTransaction: RequestTransactionDTO = {
    cardNumber: '4111 1111 1111 1111',
    cardCvv: 123,
    cardExpiry: '12/28',
    cardHolder: 'Edwin Sandoval',
    productPrice: 150000,
    deliveryEmail: 'edwin@mail.com',
    clientIp: '127.0.0.1',
  } as any;


  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionAPIDomain,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();
    service = module.get<TransactionAPIDomain>(TransactionAPIDomain);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokentransaction', () => {
    it('should return data from httpService.get', async () => {
      const mockData = { data: { presigned_acceptance: { acceptance_token: 'token' } } };
      mockHttpService.get.mockReturnValue(of(mockData));
      const result = await service.getTokentransaction();
      expect(result).toEqual(mockData.data);
      expect(httpService.get).toHaveBeenCalled();
    });
    it('should throw and log error.response.data when available (lines 32-33)', async () => {
      const error = { response: { data: 'API Error' }, message: 'error' };
      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getTokentransaction()).rejects.toEqual(error);
    });

    it('should throw and log error.message when response.data is undefined (lines 32-33)', async () => {
      const error = { message: 'Network Error' };
      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getTokentransaction()).rejects.toEqual(error);
    });
  });

  describe('RegisterCardtransaction', () => {
    it('should return data from httpService.post', async () => {
      const mockData = { data: { id: 'cardId' } };
      mockHttpService.post.mockReturnValue(of(mockData));
      const request = {
        cardNumber: '1234 5678 9012 3456',
        cardCvv: 123,
        cardExpiry: '12/30',
        cardHolder: 'Test User',
      };
      const result = await service.RegisterCardtransaction(request as any);
      expect(result).toEqual(mockData.data);
      expect(httpService.post).toHaveBeenCalled();
    });

    it('should throw and log error.response.data when available (lines 61-62)', async () => {
      const error = { response: { data: 'Card Error' }, message: 'error' };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(service.RegisterCardtransaction(mockRequestTransaction)).rejects.toEqual(error);
    });

    it('should throw and log error.message when response.data is undefined (lines 61-62)', async () => {
      const error = { message: 'Connection refused' };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(service.RegisterCardtransaction(mockRequestTransaction)).rejects.toEqual(error);
    });
  });

  describe('CompleteCardtransaction', () => {
    it('should return data from httpService.post', async () => {
      const mockData = { data: { id: 'txId', status_message: 'Success' } };
      mockHttpService.post.mockReturnValue(of(mockData));
      const request = {
        productPrice: 100,
        deliveryEmail: 'test@example.com',
        clientIp: '127.0.0.1',
      };
      const result = await service.CompleteCardtransaction(request as any, 'token', 'ref', 'acceptance');
      expect(result).toEqual(mockData.data);
      expect(httpService.post).toHaveBeenCalled();
    });

    it('should throw and log error.response.data when available (lines 111-112)', async () => {
      const error = { response: { data: 'Transaction Error' }, message: 'error' };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(
        service.CompleteCardtransaction(mockRequestTransaction, 'token', 'ref', 'accept')
      ).rejects.toEqual(error);
    });

    it('should throw and log error.message when response.data is undefined (lines 111-112)', async () => {
      const error = { message: 'Timeout' };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(
        service.CompleteCardtransaction(mockRequestTransaction, 'token', 'ref', 'accept')
      ).rejects.toEqual(error);
    });
  });

  describe('generateSignature', () => {
    it('should generate a sha256 signature', () => {
      const signature = service.generateSignature('ref', 100, 'COP', 'tok');
      expect(typeof signature).toBe('string');
      expect(signature.length).toBe(64);
    });
  });

  describe('getTransactionbyId', () => {
    it('should return data from httpService.get', async () => {
      const mockData = { data: { status: 'APPROVED' } };
      mockHttpService.get.mockReturnValue(of(mockData));
      const result = await service.getTransactionbyId('txId');
      expect(result).toEqual(mockData.data);
      expect(httpService.get).toHaveBeenCalled();
    });
    it('should throw and log error.response.data when available (lines 142-143)', async () => {
      const error = { response: { data: 'Not Found' }, message: 'error' };
      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getTransactionbyId('txn-001')).rejects.toEqual(error);
    });

    // ✅ Cubre branch línea 142: error.response?.data es undefined → usa error.message
    it('should throw and log error.message when response.data is undefined (lines 142-143)', async () => {
      const error = { message: 'Not Found' };
      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getTransactionbyId('txn-001')).rejects.toEqual(error);
    });
  });
});
