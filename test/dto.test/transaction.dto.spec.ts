import { TransactionDTO } from '../../src/products/infrastructure/dto/transaction.dto';

describe('TransactionDTO', () => {
  it('should create a TransactionDTO with correct properties', () => {
    const now = new Date();
    const dto = new TransactionDTO();
    dto.id = 'tx1';
    dto.external_transaction_id = 'ext1';
    dto.userId = 'user1';
    dto.productId = 'prod1';
    dto.reference = 'ref1';
    dto.payment_method_type = 'CARD';
    dto.amount = 100;
    dto.status = 'PENDING';
    dto.createdAt = now;
    dto.updatedAt = now;
    dto.last_response = 'OK';

    expect(dto.id).toBe('tx1');
    expect(dto.external_transaction_id).toBe('ext1');
    expect(dto.userId).toBe('user1');
    expect(dto.productId).toBe('prod1');
    expect(dto.reference).toBe('ref1');
    expect(dto.payment_method_type).toBe('CARD');
    expect(dto.amount).toBe(100);
    expect(dto.status).toBe('PENDING');
    expect(dto.createdAt).toBe(now);
    expect(dto.updatedAt).toBe(now);
    expect(dto.last_response).toBe('OK');
  });

  it('should allow updating properties', () => {
    const dto = new TransactionDTO();
    dto.status = 'PENDING';
    dto.status = 'APPROVED';
    expect(dto.status).toBe('APPROVED');
  });
});
