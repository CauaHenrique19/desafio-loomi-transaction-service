import {
  CreateTransactionRepository,
  FindUsersRepository,
} from '@transaction-service/data/protocols/db';
import { UserNotFoundError } from '@transaction-service/domain/errors';
import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';

export class CreateTransaction implements CreateTransactionUseCase {
  constructor(
    private readonly findUsersRepository: FindUsersRepository,
    private readonly createTransactionRepository: CreateTransactionRepository,
  ) {}

  async create(
    parameters: CreateTransactionUseCase.Parameters,
  ): Promise<CreateTransactionUseCase.Result> {
    const users = await this.findUsersRepository.find({
      clientId: [parameters.senderClientId, parameters.receiverClientId],
    });

    if (users.length != 2) {
      throw new UserNotFoundError();
    }

    const now = new Date();
    return this.createTransactionRepository.create({
      ...parameters,
      createdAt: now,
    });
  }
}
