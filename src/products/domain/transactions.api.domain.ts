import { Injectable, Inject } from '@nestjs/common';
import type { TransactionRepository } from '../infrastructure/repositories/transaction.repository';
import { TransactionDTO } from '../infrastructure/dto/transaction.dto';
import { RequestTransactionDTO } from '../infrastructure/dto/request.transaction.dto';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createHash } from 'crypto';

const PROD_TOK_TEST_KEY = 'test_integrity_fUNiorHNTA4t1qczJsMGysJSRIYCaybF';

@Injectable()
export class TransactionAPIDomain {
  constructor(private readonly httpService: HttpService) {}

  async getTokentransaction() {
    console.log('3. DOMAIN getTokentransaction');
    const url =
      'https://sandbox.wompi.co/v1/merchants/pub_test_vqyfdl6B3yg6HBohdCuaFhyIkAtOb6Ag';

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      console.log('4. DOMAIN getTokentransaction - making HTTP request');
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      //console.log('Response data:', response.data);

      return response.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  }

  async RegisterCardtransaction(requestTransaction: RequestTransactionDTO) {
    const url = 'https://sandbox.wompi.co/v1/tokens/cards';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer pub_test_vqyfdl6B3yg6HBohdCuaFhyIkAtOb6Ag',
    };

    const body = {
      number: requestTransaction.cardNumber.replace(/\s/g, ''),
      cvc: requestTransaction.cardCvv.toString(),
      exp_month: requestTransaction.cardExpiry.split('/')[0],
      exp_year: requestTransaction.cardExpiry.split('/')[1],
      card_holder: requestTransaction.cardHolder,
    };
    console.log('Body for RegisterCardtransaction:', body);
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      //console.log('Response data registrar transaccion:', JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  }

  async CompleteCardtransaction(
    requestTransaction: RequestTransactionDTO,
    tokentransaction: string,
    reference: string,
    acceptance_token: string,
  ) {
    const url = 'https://sandbox.wompi.co/v1/transactions';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer pub_test_vqyfdl6B3yg6HBohdCuaFhyIkAtOb6Ag',
    };

    const currency = 'COP';

    const body = {
      amount_in_cents: requestTransaction.productPrice,
      currency: currency,
      customer_email: requestTransaction.deliveryEmail,
      payment_method: {
        type: 'CARD',
        token: tokentransaction,
        installments: 1,
      },
      signature: this.generateSignature(
        reference,
        requestTransaction.productPrice,
        currency,
        PROD_TOK_TEST_KEY,
      ),
      payment_method_type: 'CARD',
      reference: reference,
      acceptance_token: acceptance_token,
      ip: requestTransaction.clientIp,
      redirect_url: 'http://localhost:5173/status',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      console.log('Response data registrar transaccion:', response.data);

      return response.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  }

  generateSignature(
    reference: string,
    amount_in_cents: number,
    currency: string,
    tokentransaction: string,
  ): string {
    const cadena = `${reference}${amount_in_cents}${currency}${tokentransaction}`;

    return createHash('sha256').update(cadena).digest('hex');
  }

  async getTransactionbyId(transactionId: string) {
    const url = `https://sandbox.wompi.co/v1/transactions/${transactionId}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      console.log('Response data:', response.data);

      return response.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  }
}
