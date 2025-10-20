import { Inject } from '@nestjs/common';
import { EntityTarget, FindOptionsWhere, Repository } from 'typeorm';

import {
  CreateUserRepository,
  DeleteUserRepository,
  FindUsersRepository,
  UpdateUserRepository,
} from '@transaction-service/data/protocols/db';
import { User } from '@transaction-service/infra/orm/entities';
import { USER_REPOSITORY } from '@transaction-service/infra/orm/typeorm/typeorm.repositories';
import { AppDataSource } from '@transaction-service/infra/orm/typeorm/data-source';
import { StatusEnum } from '@transaction-service/domain/enums';

export class UserRepository
  implements
    CreateUserRepository,
    FindUsersRepository,
    UpdateUserRepository,
    DeleteUserRepository
{
  private readonly userRepository: Repository<User>;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly User: EntityTarget<User>,
  ) {
    this.userRepository = AppDataSource.getRepository(this.User);
  }

  find(
    parameters?: FindUsersRepository.Parameters,
  ): Promise<FindUsersRepository.Result> {
    const where: FindOptionsWhere<User> = {};

    if (parameters?.id) {
      where.id = parameters.id;
    }

    return this.userRepository.find({
      where,
    });
  }

  async create(
    parameters: CreateUserRepository.Parameters,
  ): Promise<CreateUserRepository.Result> {
    const user = new User();
    Object.assign(user, parameters);

    await this.userRepository.save(user);
    return user;
  }

  async update(
    parameters: UpdateUserRepository.Parameters,
  ): Promise<UpdateUserRepository.Result> {
    await this.userRepository.update(
      { clientId: parameters.clientId },
      parameters,
    );
  }

  async delete(
    parameters: DeleteUserRepository.Parameters,
  ): Promise<DeleteUserRepository.Result> {
    await this.userRepository.update(
      {
        clientId: parameters.clientId,
      },
      {
        status: StatusEnum.INACTIVE,
      },
    );
  }
}
