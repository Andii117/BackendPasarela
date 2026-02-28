import { Controller, Get, Post, Param, NotFoundException, Body } from '@nestjs/common';
import { TransactionService } from '../../application/transaction.service';
import { TransactionDTO } from '../dto/transaction.dto';
import { RequestTransactionDTO } from '../dto/request.transaction.dto';

@Controller('transactions')
export class TransactionController {

  constructor(private readonly transactionService: TransactionService) {}

  @Post('createTransaction')  
  async createTransactions(@Body() requestTransaction: RequestTransactionDTO) { 
    console.log("CONTROLLER transactionRepo", requestTransaction);
    const createdTransaction = await this.transactionService.createtransaction(requestTransaction);
    console.log("CONTROLLER createdTransaction", createdTransaction);
    return createdTransaction;
  }

}
