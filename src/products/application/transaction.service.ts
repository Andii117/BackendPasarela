import { Injectable, Inject } from '@nestjs/common';
import { TransactionDTO } from '../infrastructure/dto/transaction.dto';
import { RequestTransactionDTO } from '../infrastructure/dto/request.transaction.dto';
import { TransactionAPIDomain } from '../domain/transactions.api.domain';
import { TransactionRepository } from '../infrastructure/repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionAPIDomain')
    private readonly transactionAPI: TransactionAPIDomain,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async createtransaction(requestTransaction: RequestTransactionDTO) {
    let acceptance_token: string = '';
    let tokentransaction: string = '';
    let reference: string = `test-${Date.now()}`;
    let transactionId: string = '';

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
    const transactionData: TransactionDTO = {
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
      id: '',
    };
    console.log('6.1,registrando la creación de la transaccion en pendiente');
    const newTransaction =
      await this.transactionRepository.createtransaction(transactionData);
    console.log('6.2, transaccion registrada en pendiente:', newTransaction);
    console.log('7. Variables before CompleteCardtransaction:');
    console.log(' customer_email: ', requestTransaction.deliveryEmail);
    await this.transactionAPI
      .CompleteCardtransaction(
        requestTransaction,
        tokentransaction,
        reference,
        acceptance_token,
      )
      .then((response) => {
        //console.log('Response from CompleteCardtransaction:', response);
        transactionId = response.data.id;
        console.log(' transactionId:', transactionId);
      });

    console.log('8. Variables after CompleteCardtransaction:');
    await this.transactionAPI
      .getTransactionbyId(transactionId)
      .then((response) => {
        //console.log('Response from getTransactionbyId:', response);
        const estatus = response.data.status;
        console.log('Transaction status:', estatus);
      });

    return transactionId;
  }
}
