import { UpdateUserRepository } from '@transaction-service/data/protocols/db';
import { UpdateUserUseCase } from '@transaction-service/domain/usecases';

export class UpdateUser implements UpdateUserUseCase {
  constructor(private readonly updateUserRepository: UpdateUserRepository) {}

  async update(
    parameters: UpdateUserUseCase.Parameters,
  ): Promise<UpdateUserUseCase.Result> {
    await this.updateUserRepository.update(parameters);
  }
}
