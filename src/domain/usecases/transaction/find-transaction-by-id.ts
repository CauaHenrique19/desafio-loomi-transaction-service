import { TransactionModel } from '@transaction-service/domain/models';

export interface FindTransactionByIdUseCase {
  find(
    parameters: FindTransactionByIdUseCase.Parameters,
  ): Promise<FindTransactionByIdUseCase.Result>;
}

export namespace FindTransactionByIdUseCase {
  export type Parameters = Pick<TransactionModel, 'id'>;
  export type Result = TransactionModel;
}
