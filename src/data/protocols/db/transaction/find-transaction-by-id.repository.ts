import { TransactionModel } from '@transaction-service/domain/models';

export interface FindTransactionByIdRepository {
  findById(
    parameters: FindTransactionByIdRepository.Parameters,
  ): Promise<FindTransactionByIdRepository.Result>;
}

export namespace FindTransactionByIdRepository {
  export type Parameters = Pick<TransactionModel, 'id'>;
  export type Result = TransactionModel | null;
}
