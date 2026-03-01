import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { TransactionDTO } from '../infrastructure/dto/transaction.dto';
import { RequestTransactionDTO } from '../infrastructure/dto/request.transaction.dto';
import { TransactionAPIDomain } from '../domain/transactions.api.domain';
import { TransactionRepository } from '../infrastructure/repositories/transaction.repository';
import type { ProductRepository } from '../domain/product.repository.interface';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionAPIDomain')
    private readonly transactionAPI: TransactionAPIDomain,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async createtransaction(requestTransaction: RequestTransactionDTO) {
    let acceptance_token: string = '';
    let tokentransaction: string = '';
    let reference: string = `test-${Date.now()}`;
    let transactionId = '';
    let transactionStatus = '';
    let transactionStatusMessage: string | null = null;
    let transactionData: TransactionDTO;
    let idTransactionPending: string = '';
    let estatus: string = '';
    let intentos = 0;

    console.log('2. SERVICE requestTransaction');
    await this.transactionAPI.getTokentransaction().then((response) => {
      //console.log('Response from getTokentransaction:', response);
      console.log(' 5. Response from getTokentransaction:');
      acceptance_token = response.data.presigned_acceptance.acceptance_token;
      console.log(' acceptance_token:', acceptance_token);
    });
    console.log(
      '-----------requestTransaction------------',
      JSON.stringify(requestTransaction),
    );
    await this.transactionAPI
      .RegisterCardtransaction(requestTransaction)
      .then((response) => {
        //console.log('Response from RegisterCardtransaction:', response);
        console.log('6. Response from RegisterCardtransaction:');
        tokentransaction = response.data.id; ///Validar por q hizo esto aca
      });
    transactionData = {
      external_transaction_id: 'PENDING_' + reference,
      userId: 'user-test-001',
      productId: requestTransaction.productId,
      reference: reference,
      payment_method_type: 'CARD',
      amount: requestTransaction.productPrice,
      status: 'PENDING',
      last_response: 'Iniciando proceso de pago',
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uuidv4(),
    };
    const newTransaction =
      await this.transactionRepository.createtransaction(transactionData);
    await this.transactionAPI
      .CompleteCardtransaction(
        requestTransaction,
        tokentransaction,
        reference,
        acceptance_token,
      )
      .then((response) => {
        transactionId = response.data.id;
        transactionStatus = response.data.status;
        transactionStatusMessage = response.data.status_message;
        console.log(' transactionId:', transactionId);
      });

    idTransactionPending = newTransaction.id;

    while (
      !['APPROVED', 'DECLINED', 'ERROR'].includes(estatus) &&
      intentos < 5
    ) {
      await this.delay(3000);
      await this.transactionAPI
        .getTransactionbyId(transactionId)
        .then((response) => {
          estatus = response.data.status;
        });
      intentos++;
    }

    await this.transactionRepository.updateTransaction(idTransactionPending, {
      status: estatus,
      external_transaction_id: transactionId,
      last_response: 'Transacción completada con status: ' + estatus,
    });

    await this.productRepository.decrementStock(
      requestTransaction.productId,
      1,
    );
    return {
      id: transactionId,
      status: transactionStatus,
      status_message: transactionStatusMessage,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
