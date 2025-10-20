import { Controller, Logger } from '@nestjs/common';

import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { listenerAdapter } from '@transaction-service/main/adapters/listener.adapter';
import {
  BuildCreateUserListener,
  BuildUpdateUserListener,
  BuildDeleteUserListener,
} from '@transaction-service/main/factories/listeners';
import {
  CreateUserDTO,
  DeleteUserDTO,
  UpdateUserDTO,
} from '@transaction-service/main/controllers/user/dto';
import {
  handleCommitOffsetKafka,
  handleRetryKafka,
} from '@transaction-service/main/utils';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name, {
    timestamp: true,
  });

  constructor(
    private readonly buildCreateUserListener: BuildCreateUserListener,
    private readonly buildUpdateUserListener: BuildUpdateUserListener,
    private readonly buildDeleteUserListener: BuildDeleteUserListener,
  ) {}

  @MessagePattern('created_user')
  async create(
    @Payload() payload: CreateUserDTO,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const result = await listenerAdapter(
      this.buildCreateUserListener.build(),
      payload,
    );

    if (result.processed) {
      await handleCommitOffsetKafka(context);
    } else {
      await handleRetryKafka(context, result.error, this.logger);
    }
  }

  @MessagePattern('updated_user')
  async update(
    @Payload() payload: UpdateUserDTO,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const result = await listenerAdapter(
      this.buildUpdateUserListener.build(),
      payload,
    );

    if (result.processed) {
      await handleCommitOffsetKafka(context);
    } else {
      await handleRetryKafka(context, result.error, this.logger);
    }
  }

  @MessagePattern('deleted_user')
  async delete(
    @Payload() payload: DeleteUserDTO,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const result = await listenerAdapter(
      this.buildDeleteUserListener.build(),
      payload,
    );

    if (result.processed) {
      await handleCommitOffsetKafka(context);
    } else {
      await handleRetryKafka(context, result.error, this.logger);
    }
  }
}
