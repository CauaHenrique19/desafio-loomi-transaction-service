import { Provider } from '@nestjs/common';

import { FIND_TRANSACTION_BY_CLIENT_ID_FACTORY } from '@transaction-service/main/factories/providers';
import { FindTransactionByClientIdUseCase } from '@transaction-service/domain/usecases';
import { FindTransactionByClientId } from '@transaction-service/data/usecases';
import {
  TransactionRepository,
  UserRepository,
} from '@transaction-service/infra/orm/repositories';
import { CACHE_ADAPTER, RedisAdapter } from '@transaction-service/infra/redis';

export const findTransactionByClientIdFactory: Provider = {
  provide: FIND_TRANSACTION_BY_CLIENT_ID_FACTORY,
  useFactory: (
    transactionRepository: TransactionRepository,
    userRepository: UserRepository,
    redisAdapter: RedisAdapter,
  ): FindTransactionByClientIdUseCase => {
    return new FindTransactionByClientId(
      redisAdapter,
      userRepository,
      transactionRepository,
    );
  },
  inject: [TransactionRepository, UserRepository, CACHE_ADAPTER],
};
