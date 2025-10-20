import {
  BuildCreateUserListener,
  BuildUpdateUserListener,
  BuildDeleteUserListener,
} from '@transaction-service/main/factories/listeners';
import { FactoryModule } from '@transaction-service/main/factories/usecases/factory.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [FactoryModule],
  controllers: [UserController],
  providers: [
    BuildCreateUserListener,
    BuildUpdateUserListener,
    BuildDeleteUserListener,
  ],
})
export class UserModule {}
