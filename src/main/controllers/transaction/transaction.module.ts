import { Module } from '@nestjs/common';

import {
  BuildCreateTransactionController,
  BuildFindTransactionByClientIdController,
  BuildFindTransactionByIdController,
} from '@transaction-service/main/factories/controllers';
import { FactoryModule } from '@transaction-service/main/factories/usecases/factory.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [FactoryModule],
  controllers: [TransactionController],
  providers: [
    {
      provide: BuildCreateTransactionController.name,
      useClass: BuildCreateTransactionController,
    },
    {
      provide: BuildFindTransactionByIdController.name,
      useClass: BuildFindTransactionByIdController,
    },

    {
      provide: BuildFindTransactionByClientIdController.name,
      useClass: BuildFindTransactionByClientIdController,
    },
  ],
})
export class TransactionModule {}
