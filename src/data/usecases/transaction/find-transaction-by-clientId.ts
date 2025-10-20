import { CacheAdapter } from '@transaction-service/data/protocols/cache';
import {
  FindTransactionByClientIdRepository,
  FindUsersRepository,
} from '@transaction-service/data/protocols/db';
import { UserNotFoundError } from '@transaction-service/domain/errors';
import { FindTransactionByClientIdUseCase } from '@transaction-service/domain/usecases';

export class FindTransactionByClientId
  implements FindTransactionByClientIdUseCase
{
  constructor(
    private readonly cacheAdapter: CacheAdapter,
    private readonly findUsersRepository: FindUsersRepository,
    private readonly findTransactionByClientIdRepository: FindTransactionByClientIdRepository,
  ) {}

  async find(
    parameters: FindTransactionByClientIdUseCase.Parameters,
  ): Promise<FindTransactionByClientIdUseCase.Result> {
    const key = `client-transactions:${parameters.clientId}`;
    const transactionsInCache = await this.cacheAdapter.get(key);

    if (transactionsInCache) {
      return JSON.parse(transactionsInCache);
    }

    const user = await this.findUsersRepository.find({
      clientId: parameters.clientId,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const transactions =
      await this.findTransactionByClientIdRepository.findByClientId({
        clientId: parameters.clientId,
      });

    await this.cacheAdapter.set(key, JSON.stringify(transactions));
    return transactions;
  }
}
