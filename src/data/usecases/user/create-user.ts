import { CreateUserRepository } from '@transaction-service/data/protocols/db';
import { StatusEnum } from '@transaction-service/domain/enums';
import { CreateUserUseCase } from '@transaction-service/domain/usecases';

export class CreateUser implements CreateUserUseCase {
  constructor(private readonly createUserRepository: CreateUserRepository) {}

  async create(
    parameters: CreateUserUseCase.Parameters,
  ): Promise<CreateUserUseCase.Result> {
    const now = new Date();

    await this.createUserRepository.create({
      ...parameters,
      status: StatusEnum.ACTIVE,
      createdAt: now,
    });
  }
}
