import { Provider } from '@nestjs/common';

import { CREATE_TRANSACTION_FACTORY } from '@transaction-service/main/factories/providers';
import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';
import { CreateTransaction } from '@transaction-service/data/usecases';
import {
  TransactionRepository,
  UserRepository,
} from '@transaction-service/infra/orm/repositories';

export const createTransactionFactory: Provider = {
  provide: CREATE_TRANSACTION_FACTORY,
  useFactory: (
    transactionRepository: TransactionRepository,
    userRepository: UserRepository,
  ): CreateTransactionUseCase => {
    return new CreateTransaction(userRepository, transactionRepository);
  },
  inject: [TransactionRepository, UserRepository],
};
