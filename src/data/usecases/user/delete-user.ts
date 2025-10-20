import { DeleteUserRepository } from '@transaction-service/data/protocols/db';
import { DeleteUserUseCase } from '@transaction-service/domain/usecases';

export class DeleteUser implements DeleteUserUseCase {
  constructor(private readonly deleteUserRepository: DeleteUserRepository) {}

  async delete(
    parameters: DeleteUserUseCase.Parameters,
  ): Promise<DeleteUserUseCase.Result> {
    await this.deleteUserRepository.delete(parameters);
  }
}
