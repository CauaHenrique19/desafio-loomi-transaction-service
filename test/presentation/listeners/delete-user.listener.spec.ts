import { DeleteUserUseCase } from '@transaction-service/domain/usecases';
import { DeleteUserListener } from '@transaction-service/presentation/listeners';
import { makeFakeUser } from 'test/data/usecases/user/create-user.spec';

const fakeUser = makeFakeUser();

const makeDeleteUserUseCase = (): DeleteUserUseCase => {
  class DeleteUserUseCaseStub implements DeleteUserUseCase {
    async delete(parameters: DeleteUserUseCase.Parameters): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new DeleteUserUseCaseStub();
};

interface SutTypes {
  sut: DeleteUserListener;
  deleteUserUseCaseStub: DeleteUserUseCase;
}

const makeSut = (): SutTypes => {
  const deleteUserUseCaseStub = makeDeleteUserUseCase();
  const sut = new DeleteUserListener(deleteUserUseCaseStub);

  return { sut, deleteUserUseCaseStub };
};

describe('DeleteUserListener', () => {
  test('Should call DeleteUserUseCase with correct values', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    const spy = jest.spyOn(deleteUserUseCaseStub, 'delete');

    await sut.listen({ id: fakeUser.id });

    expect(spy).toHaveBeenCalledWith({ clientId: fakeUser.id });
  });

  test('Should return processed true on success', async () => {
    const { sut } = makeSut();

    const response = await sut.listen({ id: fakeUser.id });
    expect(response.processed).toBe(true);
  });

  test('Should return error and processed false if DeleteUserUseCase throws', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest.spyOn(deleteUserUseCaseStub, 'delete').mockImplementationOnce(() => {
      throw error;
    });

    const response = await sut.listen({ id: fakeUser.id });
    expect(response.processed).toBe(false);
    expect((response as { processed: false; error: Error }).error).toBe(error);
  });
});
