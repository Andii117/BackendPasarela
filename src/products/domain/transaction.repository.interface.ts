import { Transaction } from './transaction.entity';

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
}
