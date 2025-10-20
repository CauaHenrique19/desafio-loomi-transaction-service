import { Module } from '@nestjs/common';

import {
  TransactionRepository,
  UserRepository,
} from '@transaction-service/infra/orm/repositories';
import {
  transactionProvider,
  userProvider,
} from '@transaction-service/infra/orm/providers';
import {
  createUserFactory,
  deleteUserFactory,
  updateUserFactory,
  createTransactionFactory,
} from '@transaction-service/main/factories/usecases';

@Module({
  providers: [
    //repositories
    UserRepository,
    TransactionRepository,

    //providers
    userProvider,
    transactionProvider,

    //usecases
    createUserFactory,
    updateUserFactory,
    deleteUserFactory,

    createTransactionFactory,
  ],
  exports: [
    createUserFactory,
    updateUserFactory,
    deleteUserFactory,
    createTransactionFactory,
  ],
})
export class FactoryModule {}
