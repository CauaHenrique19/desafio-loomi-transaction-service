import { TransactionModel } from '@transaction-service/domain/models';

export interface CreateTransactionRepository {
  create(
    parameters: CreateTransactionRepository.Parameters,
  ): Promise<CreateTransactionRepository.Result>;
}

export namespace CreateTransactionRepository {
  export type Parameters = Omit<TransactionModel, 'id'>;
  export type Result = TransactionModel;
}
