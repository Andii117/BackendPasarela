import {
  Controller,
  Post,
  Body,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransactionService } from '../../application/transaction.service';
import { RequestTransactionDTO } from '../dto/request.transaction.dto';

@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post('createTransaction')
  async createTransaction(@Body() request: RequestTransactionDTO) {
    this.logger.log(
      `Received request to create transaction for product: ${request.productId}`,
    );

    try {
      // Llamada al método refactorizado con CamelCase
      const result = await this.transactionService.createTransaction(request);

      this.logger.log(`Transaction processed successfully: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error in TransactionController: ${error.message}`);

      // Manejo de errores de capa superior para evitar fugas de información sensible
      throw new InternalServerErrorException({
        message: 'No se pudo procesar la transacción en este momento.',
        error: error.message,
      });
    }
  }
}
