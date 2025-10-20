import { Provider } from '@nestjs/common';

import { User } from '@transaction-service/infra/orm/entities';
import { USER_REPOSITORY } from '@transaction-service/infra/orm/typeorm/typeorm.repositories';

export const userProvider: Provider = {
  provide: USER_REPOSITORY,
  useValue: User,
};
