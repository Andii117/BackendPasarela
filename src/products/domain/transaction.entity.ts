export class Transaction {
  constructor(
    public readonly id: string,
    public readonly external_transaction_id: string,
    public readonly userId: string,
    public readonly productId: string,
    public readonly amount: number,
    public readonly status: string,
  ) {}
}
