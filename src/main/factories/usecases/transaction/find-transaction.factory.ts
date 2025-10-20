import { Provider } from '@nestjs/common';

import { FIND_TRANSACTION_BY_ID_FACTORY } from '@transaction-service/main/factories/providers';
import { FindTransactionByIdUseCase } from '@transaction-service/domain/usecases';
import { FindTransactionById } from '@transaction-service/data/usecases';
import { TransactionRepository } from '@transaction-service/infra/orm/repositories';
import { CACHE_ADAPTER, RedisAdapter } from '@transaction-service/infra/redis';

export const findTransactionByIdFactory: Provider = {
  provide: FIND_TRANSACTION_BY_ID_FACTORY,
  useFactory: (
    transactionRepository: TransactionRepository,
    redisAdapter: RedisAdapter,
  ): FindTransactionByIdUseCase => {
    return new FindTransactionById(redisAdapter, transactionRepository);
  },
  inject: [TransactionRepository, CACHE_ADAPTER],
};
