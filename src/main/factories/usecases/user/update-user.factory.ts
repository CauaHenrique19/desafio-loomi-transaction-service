import { Provider } from '@nestjs/common';

import { UPDATE_USER_FACTORY } from '@transaction-service/main/factories/providers';
import { UpdateUserUseCase } from '@transaction-service/domain/usecases';
import { UpdateUser } from '@transaction-service/data/usecases';
import { UserRepository } from '@transaction-service/infra/orm/repositories';

export const updateUserFactory: Provider = {
  provide: UPDATE_USER_FACTORY,
  useFactory: (userRepository: UserRepository): UpdateUserUseCase => {
    return new UpdateUser(userRepository);
  },
  inject: [UserRepository],
};
