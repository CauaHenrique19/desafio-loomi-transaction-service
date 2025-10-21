import { CreateUserUseCase } from '@transaction-service/domain/usecases';
import { CreateUserListener } from '@transaction-service/presentation/listeners';
import { makeFakeUser } from 'test/data/usecases/user/create-user.spec';

const fakeUser = makeFakeUser();

const makeCreateUserUseCase = (): CreateUserUseCase => {
  class CreateUserUseCaseStub implements CreateUserUseCase {
    async create(
      parameters: CreateUserUseCase.Parameters,
    ): Promise<CreateUserUseCase.Result> {
      return new Promise((resolve) => resolve());
    }
  }

  return new CreateUserUseCaseStub();
};

interface SutTypes {
  sut: CreateUserListener;
  createUserUseCaseStub: CreateUserUseCase;
}

const makeSut = (): SutTypes => {
  const createUserUseCaseStub = makeCreateUserUseCase();
  const sut = new CreateUserListener(createUserUseCaseStub);

  return { sut, createUserUseCaseStub };
};

describe('CreateUserListener', () => {
  test('Should call CreateUserUseCase with correct values', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    const spy = jest.spyOn(createUserUseCaseStub, 'create');

    const params: CreateUserListener.Parameters = {
      id: fakeUser.clientId,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };
    await sut.listen(params);

    expect(spy).toHaveBeenCalledWith({
      clientId: fakeUser.clientId,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    });
  });

  test('Should return ok if user is created successfully', async () => {
    const { sut } = makeSut();

    const response = await sut.listen(fakeUser);
    expect(response.processed).toBe(true);
  });

  test('Should return error and processed false if CreateUserUseCase throws', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest.spyOn(createUserUseCaseStub, 'create').mockImplementationOnce(() => {
      throw error;
    });

    const response = await sut.listen(fakeUser);
    expect(response.processed).toBe(false);
    expect((response as { processed: false; error: Error }).error).toBe(error);
  });
});
