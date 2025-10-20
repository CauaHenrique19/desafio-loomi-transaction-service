import { TransactionModel } from '@transaction-service/domain/models';

export interface CreateTransactionUseCase {
  create(
    parameters: CreateTransactionUseCase.Parameters,
  ): Promise<CreateTransactionUseCase.Result>;
}

export namespace CreateTransactionUseCase {
  export type Parameters = Omit<TransactionModel, 'id' | 'createdAt'>;
  export type Result = TransactionModel;
}
