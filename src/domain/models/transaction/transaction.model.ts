export interface TransactionModel {
  id: string;
  senderClientId: string;
  receiverClientId: string;
  amount: number;
  description: string;
  createdAt: Date;
}
