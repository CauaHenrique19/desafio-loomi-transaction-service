import { UpdateUserUseCase } from '@transaction-service/domain/usecases';
import { UpdateUserListener } from '@transaction-service/presentation/listeners';
import {
  ok,
  notFound,
  serverError,
} from '@transaction-service/presentation/helpers/http-helper';
import { makeFakeUser } from 'test/data/usecases/user/create-user.spec';

const fakeUser = makeFakeUser();

const makeUpdateUserUseCase = (): UpdateUserUseCase => {
  class UpdateUserUseCaseStub implements UpdateUserUseCase {
    async update(
      parameters: UpdateUserUseCase.Parameters,
    ): Promise<UpdateUserUseCase.Result> {
      return new Promise((resolve) => resolve());
    }
  }

  return new UpdateUserUseCaseStub();
};

interface SutTypes {
  sut: UpdateUserListener;
  updateUserUseCaseStub: UpdateUserUseCase;
}

const makeSut = (): SutTypes => {
  const updateUserUseCaseStub = makeUpdateUserUseCase();
  const sut = new UpdateUserListener(updateUserUseCaseStub);

  return { sut, updateUserUseCaseStub };
};

describe('UpdateUserListener', () => {
  test('Should call UpdateUserUseCase with correct values', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    const spy = jest.spyOn(updateUserUseCaseStub, 'update');

    const params: UpdateUserListener.Parameters = {
      id: fakeUser.id,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };

    await sut.listen(params);
    expect(spy).toHaveBeenCalledWith({
      clientId: fakeUser.id,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    });
  });

  test('Should return processed true if user is updated', async () => {
    const { sut } = makeSut();

    const params: UpdateUserListener.Parameters = {
      id: fakeUser.id,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };

    const response = await sut.listen(params);
    expect(response.processed).toEqual(true);
  });

  test('Should return error and processed false if UpdateUserUseCase throws a generic error', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest.spyOn(updateUserUseCaseStub, 'update').mockImplementationOnce(() => {
      throw error;
    });

    const params: UpdateUserListener.Parameters = {
      id: fakeUser.id,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };

    const response = await sut.listen(params);
    expect(response.processed).toBe(false);
    expect((response as { processed: false; error: Error }).error).toBe(error);
  });
});
