import { Provider } from '@nestjs/common';

import { CREATE_USER_FACTORY } from '@transaction-service/main/factories/providers';
import { CreateUserUseCase } from '@transaction-service/domain/usecases';
import { CreateUser } from '@transaction-service/data/usecases';
import { UserRepository } from '@transaction-service/infra/orm/repositories';

export const createUserFactory: Provider = {
  provide: CREATE_USER_FACTORY,
  useFactory: (userRepository: UserRepository): CreateUserUseCase => {
    return new CreateUser(userRepository);
  },
  inject: [UserRepository],
};
