export interface TransactionModel {
  id: string;
  senderClientId: string;
  receiverClientId: string;
  amout: number;
  description: string;
  createdAt: Date;
}
