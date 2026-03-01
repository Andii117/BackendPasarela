import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TransactionDTO } from '../dto/transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createtransaction(transaction: TransactionDTO) {
    return await this.prisma.transactions.create({
      data: transaction,
    });
  }

  async updateTransaction(id: string, data: Partial<TransactionDTO>) {
    return this.prisma.transactions.update({
      where: { id },
      data: {
        status: data.status,
        external_transaction_id: data.external_transaction_id,
        last_response: data.last_response,
        updatedAt: new Date(),
      },
    });
  }
}
