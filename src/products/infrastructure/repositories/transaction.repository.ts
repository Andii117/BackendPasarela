import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TransactionDTO } from '../dto/transaction.dto';

@Injectable()
export class TransactionRepository  {

  constructor(private readonly prisma: PrismaService) {}
    
  createtransaction(transaction: TransactionDTO){
    return this.prisma.transactions.create({
      data: transaction
    });
  }
}
