import { UserModel } from '@transaction-service/domain/models';

export interface UpdateUserRepository {
  update(
    parameters: UpdateUserRepository.Parameters,
  ): Promise<UpdateUserRepository.Result>;
}

export namespace UpdateUserRepository {
  export type Parameters = Pick<UserModel, 'clientId'> &
    Partial<
      Omit<UserModel, 'id' | 'clientId' | 'status' | 'createdAt' | 'deletedAt'>
    >;
  export type Result = void;
}
