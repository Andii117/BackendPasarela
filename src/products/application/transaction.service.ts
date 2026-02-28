import { Injectable, Inject } from '@nestjs/common';
import type { TransactionRepository } from '../infrastructure/repositories/transaction.repository';
import { TransactionDTO } from '../infrastructure/dto/transaction.dto';
import { RequestTransactionDTO } from '../infrastructure/dto/request.transaction.dto';
import { TransactionAPIDomain } from '../domain/transactions.api.domain';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionAPIDomain') private readonly transactionAPI: TransactionAPIDomain,
  ) {}

  async createtransaction(requestTransaction: RequestTransactionDTO){

    let acceptance_token: string = "";
    let tokentransaction: string = "";
    let reference: string = `test-${Date.now()}`;
    let transactionId: string = "";

    await this.transactionAPI.getTokentransaction()
    .then((response) => {
      console.log("Response from getTokentransaction:", response);
      acceptance_token = response.data.presigned_acceptance.acceptance_token;
     
    });
    await this.transactionAPI.RegisterCardtransaction(requestTransaction)
    .then((response) => {
      console.log("Response from RegisterCardtransaction:", response);
      tokentransaction = response.data.id;
    });
    await this.transactionAPI.CompleteCardtransaction(requestTransaction, tokentransaction, reference, acceptance_token)
    .then((response) => {
      console.log("Response from CompleteCardtransaction:", response);
      transactionId = response.data.id;
    });

    await this.transactionAPI.getTransactionbyId(transactionId)
    .then((response) => {
      console.log("Response from getTransactionbyId:", response);
      const estatus = response.data.status;
      console.log("Transaction status:", estatus);
    });



     return transactionId;
}

}

    
