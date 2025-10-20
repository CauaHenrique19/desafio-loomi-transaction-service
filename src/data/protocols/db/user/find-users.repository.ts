import { UserModel } from '@transaction-service/domain/models';

export interface FindUsersRepository {
  find(
    parameters?: FindUsersRepository.Parameters,
  ): Promise<FindUsersRepository.Result>;
}

export namespace FindUsersRepository {
  export type Parameters = {
    id?: string;
  };
  export type Result = UserModel[];
}
