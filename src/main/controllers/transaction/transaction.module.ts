import { Module } from '@nestjs/common';

import {
  BuildCreateTransactionController,
  BuildFindTransactionByIdController,
} from '@transaction-service/main/factories/controllers';
import { FactoryModule } from '@transaction-service/main/factories/usecases/factory.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [FactoryModule],
  controllers: [TransactionController],
  providers: [
    BuildCreateTransactionController,
    BuildFindTransactionByIdController,
  ],
})
export class TransactionModule {}
