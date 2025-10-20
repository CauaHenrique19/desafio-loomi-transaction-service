import { Module } from '@nestjs/common';

import { BuildCreateTransactionController } from '@transaction-service/main/factories/controllers';
import { FactoryModule } from '@transaction-service/main/factories/usecases/factory.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [FactoryModule],
  controllers: [TransactionController],
  providers: [BuildCreateTransactionController],
})
export class TransactionModule {}
