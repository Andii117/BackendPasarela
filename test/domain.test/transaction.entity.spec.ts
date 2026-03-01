import { Transaction } from '../../src/products/domain/transaction.entity';

describe('Transaction', () => {

  const mockTransactionData = {
    id: 'txn-001',
    external_transaction_id: 'ext-abc-123',
    userId: 'user-001',
    productId: 'prod-001',
    amount: 150.00,
    status: 'PENDING',
  };

  describe('constructor', () => {
    it('should create a Transaction instance with correct properties', () => {
      const transaction = new Transaction(
        mockTransactionData.id,
        mockTransactionData.external_transaction_id,
        mockTransactionData.userId,
        mockTransactionData.productId,
        mockTransactionData.amount,
        mockTransactionData.status,
      );

      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction.id).toBe('txn-001');
      expect(transaction.external_transaction_id).toBe('ext-abc-123');
      expect(transaction.userId).toBe('user-001');
      expect(transaction.productId).toBe('prod-001');
      expect(transaction.amount).toBe(150.00);
      expect(transaction.status).toBe('PENDING');
    });

    it('should create a Transaction with APPROVED status', () => {
      const transaction = new Transaction(
        'txn-002',
        'ext-xyz-456',
        'user-002',
        'prod-002',
        200.00,
        'APPROVED',
      );

      expect(transaction.status).toBe('APPROVED');
      expect(transaction.amount).toBe(200.00);
    });

    it('should create a Transaction with DECLINED status', () => {
      const transaction = new Transaction(
        'txn-003',
        'ext-def-789',
        'user-003',
        'prod-003',
        50.00,
        'DECLINED',
      );

      expect(transaction.status).toBe('DECLINED');
    });

    it('should accept amount of zero', () => {
      const transaction = new Transaction(
        'txn-004', 'ext-000', 'user-004', 'prod-004', 0, 'PENDING'
      );

      expect(transaction.amount).toBe(0);
    });
  });

 
});