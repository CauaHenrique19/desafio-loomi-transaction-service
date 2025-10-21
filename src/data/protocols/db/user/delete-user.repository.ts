import { UserModel } from '@transaction-service/domain/models';

export interface DeleteUserRepository {
  delete(
    parameters: DeleteUserRepository.Parameters,
  ): Promise<DeleteUserRepository.Result>;
}

export namespace DeleteUserRepository {
  export type Parameters = Pick<UserModel, 'clientId'>;
  export type Result = void;
}
