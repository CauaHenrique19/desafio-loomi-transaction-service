import { UserModel } from '@transaction-service/domain/models';

export interface CreateUserRepository {
  create(
    parameters: CreateUserRepository.Parameters,
  ): Promise<CreateUserRepository.Result>;
}

export namespace CreateUserRepository {
  export type Parameters = Omit<UserModel, 'id'>;
  export type Result = UserModel;
}
