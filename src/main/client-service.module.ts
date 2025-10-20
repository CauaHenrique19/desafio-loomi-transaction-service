import { Module } from '@nestjs/common';

import { TypeormModule } from '@transaction-service/infra/orm/typeorm/typeorm.module';
import { UserModule } from '@transaction-service/main/controllers/user/user.module';
import { TransactionModule } from '@transaction-service/main/controllers/transaction/transaction.module';

@Module({
  imports: [TypeormModule, UserModule, TransactionModule],
})
export class ClientServiceModule {}
