export class TransactionDTO {
  id: string;
  external_transaction_id: string;
  userId: string;
  productId: string;
  reference: string;
  payment_method_type: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  last_response: string;
}
