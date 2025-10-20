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
  findTransactionByIdFactory,
  findTransactionByClientIdFactory,
} from '@transaction-service/main/factories/usecases';
import { redisProvider } from '@transaction-service/infra/redis';

@Module({
  providers: [
    redisProvider,

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
    findTransactionByIdFactory,
    findTransactionByClientIdFactory,
  ],
  exports: [
    redisProvider,

    createUserFactory,
    updateUserFactory,
    deleteUserFactory,
    createTransactionFactory,
    findTransactionByIdFactory,
    findTransactionByClientIdFactory,
  ],
})
export class FactoryModule {}
