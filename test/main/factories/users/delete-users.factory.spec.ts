import { DeleteUserUseCase } from '@transaction-service/domain/usecases';
import { BuildDeleteUserListener } from '@transaction-service/main/factories/listeners';
import { DeleteUserListener } from '@transaction-service/presentation/listeners';

const makeDeleteUser = () => {
  class DeleteUsersStub implements DeleteUserUseCase {
    async delete(): Promise<DeleteUserUseCase.Result> {
      return new Promise((resolve) => resolve());
    }
  }

  return new DeleteUsersStub();
};

export interface sutTypes {
  sut: DeleteUserListener;
  deleteUsersStub: DeleteUserUseCase;
}

const makeSut = (): sutTypes => {
  const deleteUsersStub = makeDeleteUser();
  const sut = new DeleteUserListener(deleteUsersStub);

  return {
    sut,
    deleteUsersStub,
  };
};

jest.mock(
  '@transaction-service/main/factories/listeners/user/delete-user.factory.ts',
);

describe('BuildDeleteUserListener', () => {
  test('Should be able to build the controller correctly', () => {
    const { deleteUsersStub } = makeSut();
    new BuildDeleteUserListener(deleteUsersStub);

    expect(BuildDeleteUserListener).toHaveBeenCalledWith(deleteUsersStub);
  });
});
