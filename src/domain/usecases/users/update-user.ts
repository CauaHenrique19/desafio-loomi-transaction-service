import { UserModel } from '@transaction-service/domain/models';

export interface UpdateUserUseCase {
  update(
    parameters: UpdateUserUseCase.Parameters,
  ): Promise<UpdateUserUseCase.Result>;
}

export namespace UpdateUserUseCase {
  export type Parameters = Pick<UserModel, 'clientId'> &
    Partial<Omit<UserModel, 'id' | 'clientId' | 'status' | 'createdAt'>>;
  export type Result = void;
}
