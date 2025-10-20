import { Module } from '@nestjs/common';

import { UserRepository } from '@transaction-service/infra/orm/repositories';
import { userProvider } from '@transaction-service/infra/orm/providers';
import {
  createUserFactory,
  deleteUserFactory,
  updateUserFactory,
} from '@transaction-service/main/factories/usecases';

@Module({
  providers: [
    //repositories
    UserRepository,

    //providers
    userProvider,

    //usecases
    createUserFactory,

    updateUserFactory,
    deleteUserFactory,
  ],
  exports: [createUserFactory, updateUserFactory, deleteUserFactory],
})
export class FactoryModule {}
