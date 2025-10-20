import { Provider } from '@nestjs/common';

import { Transaction } from '@transaction-service/infra/orm/entities';
import { TRANSACTION_REPOSITORY } from '@transaction-service/infra/orm/typeorm/typeorm.repositories';

export const transactionProvider: Provider = {
  provide: TRANSACTION_REPOSITORY,
  useValue: Transaction,
};
