import { Provider } from '@nestjs/common';

import { DELETE_USER_FACTORY } from '@transaction-service/main/factories/providers';
import { DeleteUserUseCase } from '@transaction-service/domain/usecases';
import { DeleteUser } from '@transaction-service/data/usecases';
import { UserRepository } from '@transaction-service/infra/orm/repositories';

export const deleteUserFactory: Provider = {
  provide: DELETE_USER_FACTORY,
  useFactory: (userRepository: UserRepository): DeleteUserUseCase => {
    return new DeleteUser(userRepository);
  },
  inject: [UserRepository],
};
