import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { TransactionDTO } from '../infrastructure/dto/transaction.dto';
import { RequestTransactionDTO } from '../infrastructure/dto/request.transaction.dto';
import { TransactionAPIDomain } from '../domain/transactions.api.domain';
import { TransactionRepository } from '../infrastructure/repositories/transaction.repository';
import type { ProductRepository } from '../domain/product.repository.interface';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private readonly MAX_POLLING_ATTEMPTS = 5;
  private readonly POLLING_DELAY_MS = 3000;

  constructor(
    @Inject('TransactionAPIDomain')
    private readonly transactionAPI: TransactionAPIDomain,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async createTransaction(request: RequestTransactionDTO) {
    try {
      this.logger.log(
        `Starting transaction process for product: ${request.productId}`,
      );

      // 1. Obtener tokens necesarios de la pasarela
      const acceptanceToken = await this.getAcceptanceToken();
      const cardToken = await this.registerCard(request);

      // 2. Preparar y persistir transacción local en PENDING
      const reference = `REF-${Date.now()}`;
      const newTransaction = await this.saveInitialTransaction(
        request,
        reference,
      );

      // 3. Ejecutar pago en la pasarela
      const paymentResponse = await this.transactionAPI.CompleteCardtransaction(
        request,
        cardToken,
        reference,
        acceptanceToken,
      );

      const gatewayId = paymentResponse.data.id;

      // 4. Polling: Esperar estado final (APPROVED/DECLINED)
      const finalStatus = await this.pollTransactionStatus(gatewayId);

      // 5. Actualizar registros finales y stock
      await this.finalizeTransaction(
        newTransaction.id,
        gatewayId,
        finalStatus,
        request.productId,
      );

      return {
        id: gatewayId,
        status: finalStatus,
        status_message: paymentResponse.data.status_message,
      };
    } catch (error) {
      this.logger.error(`Transaction failed: ${error.message}`);
      throw error;
    }
  }

  // --- Métodos Privados (Single Responsibility) ---

  private async getAcceptanceToken(): Promise<string> {
    const response = await this.transactionAPI.getTokentransaction();
    return response.data.presigned_acceptance.acceptance_token;
  }

  private async registerCard(request: RequestTransactionDTO): Promise<string> {
    const response = await this.transactionAPI.RegisterCardtransaction(request);
    return response.data.id;
  }

  private async saveInitialTransaction(
    request: RequestTransactionDTO,
    reference: string,
  ) {
    const transactionData: TransactionDTO = {
      id: uuidv4(),
      external_transaction_id: `PENDING_${reference}`,
      userId: 'user-test-001', // ID hardcoded según requerimiento seed
      productId: request.productId,
      reference,
      payment_method_type: 'CARD',
      amount: request.productPrice,
      status: 'PENDING',
      last_response: 'Iniciando proceso de pago',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.transactionRepository.createtransaction(transactionData);
  }

  private async pollTransactionStatus(gatewayId: string): Promise<string> {
    let status = 'PENDING';
    let attempts = 0;

    const finalStatuses = ['APPROVED', 'DECLINED', 'ERROR', 'VOIDED'];

    while (
      !finalStatuses.includes(status) &&
      attempts < this.MAX_POLLING_ATTEMPTS
    ) {
      await this.sleep(this.POLLING_DELAY_MS);
      const response = await this.transactionAPI.getTransactionbyId(gatewayId);
      status = response.data.status;
      attempts++;
    }
    return status;
  }

  private async finalizeTransaction(
    localId: string,
    gatewayId: string,
    status: string,
    productId: string,
  ) {
    // Actualizar transacción
    await this.transactionRepository.updateTransaction(localId, {
      status,
      external_transaction_id: gatewayId,
      last_response: `Transaction finalized with status: ${status}`,
    });

    // Solo descontamos stock si fue aprobada
    if (status === 'APPROVED') {
      await this.productRepository.decrementStock(productId, 1);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
