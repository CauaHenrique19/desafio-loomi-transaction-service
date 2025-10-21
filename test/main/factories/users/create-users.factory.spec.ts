import { CreateUserUseCase } from '@transaction-service/domain/usecases';
import { BuildCreateUserListener } from '@transaction-service/main/factories/listeners';
import { CreateUserListener } from '@transaction-service/presentation/listeners';
import { makeFakeUser } from 'test/data/usecases/user/create-user.spec';

const fakeUser = makeFakeUser()[0];

const makeCreateUser = () => {
  class CreateUsersStub implements CreateUserUseCase {
    async create(): Promise<CreateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new CreateUsersStub();
};

export interface sutTypes {
  sut: CreateUserListener;
  createUsersStub: CreateUserUseCase;
}

const makeSut = (): sutTypes => {
  const createUsersStub = makeCreateUser();
  const sut = new CreateUserListener(createUsersStub);

  return {
    sut,
    createUsersStub,
  };
};

jest.mock(
  '@transaction-service/main/factories/listeners/user/create-user.factory.ts',
);

describe('BuildCreateUserListener', () => {
  test('Should be able to build the controller correctly', () => {
    const { createUsersStub } = makeSut();
    new BuildCreateUserListener(createUsersStub);

    expect(BuildCreateUserListener).toHaveBeenCalledWith(createUsersStub);
  });
});
