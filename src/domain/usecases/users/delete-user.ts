import { UserModel } from '@transaction-service/domain/models';

export interface DeleteUserUseCase {
  delete(
    parameters: DeleteUserUseCase.Parameters,
  ): Promise<DeleteUserUseCase.Result>;
}

export namespace DeleteUserUseCase {
  export type Parameters = Pick<UserModel, 'clientId'>;
  export type Result = void;
}
