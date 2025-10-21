import { TransactionModel } from '@transaction-service/domain/models';

export interface FindTransactionByClientIdRepository {
  findByClientId(
    parameters: FindTransactionByClientIdRepository.Parameters,
  ): Promise<FindTransactionByClientIdRepository.Result>;
}

export namespace FindTransactionByClientIdRepository {
  export type Parameters = {
    clientId: string;
  };
  export type Result = TransactionModel[];
}
