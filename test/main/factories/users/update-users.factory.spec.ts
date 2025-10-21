import { UpdateUserUseCase } from '@transaction-service/domain/usecases';
import { BuildUpdateUserListener } from '@transaction-service/main/factories/listeners';
import { UpdateUserListener } from '@transaction-service/presentation/listeners';
import { makeFakeUser } from 'test/data/usecases/user/create-user.spec';

const fakeUser = makeFakeUser()[0];

const makeUpdateUser = () => {
  class UpdateUsersStub implements UpdateUserUseCase {
    async update(): Promise<UpdateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdateUsersStub();
};

export interface sutTypes {
  sut: UpdateUserListener;
  updateUsersStub: UpdateUserUseCase;
}

const makeSut = (): sutTypes => {
  const updateUsersStub = makeUpdateUser();
  const sut = new UpdateUserListener(updateUsersStub);

  return {
    sut,
    updateUsersStub,
  };
};

jest.mock(
  '@transaction-service/main/factories/listeners/user/update-user.factory.ts',
);

describe('BuildUpdateUserListener', () => {
  test('Should be able to build the controller correctly', () => {
    const { updateUsersStub } = makeSut();
    new BuildUpdateUserListener(updateUsersStub);

    expect(BuildUpdateUserListener).toHaveBeenCalledWith(updateUsersStub);
  });
});
