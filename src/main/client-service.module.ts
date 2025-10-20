import { Module } from '@nestjs/common';

import { TypeormModule } from '@transaction-service/infra/orm/typeorm/typeorm.module';
import { UserModule } from '@transaction-service/main/controllers/user/user.module';

@Module({
  imports: [TypeormModule, UserModule],
})
export class ClientServiceModule {}
