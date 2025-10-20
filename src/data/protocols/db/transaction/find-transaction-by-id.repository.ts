import { TransactionModel } from '@transaction-service/domain/models';

export interface FindTransactionByIdRepository {
  find(
    parameters: FindTransactionByIdRepository.Parameters,
  ): Promise<FindTransactionByIdRepository.Result>;
}

export namespace FindTransactionByIdRepository {
  export type Parameters = Pick<TransactionModel, 'id'>;
  export type Result = TransactionModel | null;
}
