import { CacheAdapter } from '@transaction-service/data/protocols/cache';
import { FindTransactionByIdRepository } from '@transaction-service/data/protocols/db';
import { TransactionNotFoundError } from '@transaction-service/domain/errors';
import { FindTransactionByIdUseCase } from '@transaction-service/domain/usecases';

export class FindTransactionById implements FindTransactionByIdUseCase {
  constructor(
    private readonly cacheAdapter: CacheAdapter,
    private readonly findTransactionByIdRepository: FindTransactionByIdRepository,
  ) {}

  async find(
    parameters: FindTransactionByIdUseCase.Parameters,
  ): Promise<FindTransactionByIdUseCase.Result> {
    const key = `transaction:${parameters.id}`;
    const transactionInCache = await this.cacheAdapter.get(key);

    if (transactionInCache) {
      return JSON.parse(transactionInCache);
    }

    const transaction = await this.findTransactionByIdRepository.findById({
      id: parameters.id,
    });

    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    await this.cacheAdapter.set(key, JSON.stringify(transaction));
    return transaction;
  }
}
