import { TransactionModel } from '@transaction-service/domain/models';

export interface FindTransactionByClientIdUseCase {
  find(
    parameters: FindTransactionByClientIdUseCase.Parameters,
  ): Promise<FindTransactionByClientIdUseCase.Result>;
}

export namespace FindTransactionByClientIdUseCase {
  export type Parameters = {
    clientId: string;
  };
  export type Result = TransactionModel[];
}
