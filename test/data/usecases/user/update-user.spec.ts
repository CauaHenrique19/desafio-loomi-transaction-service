import { UpdateUserRepository } from '@transaction-service/data/protocols/db';
import { UpdateUser } from '@transaction-service/data/usecases';

const makeUpdateUserRepository = (): UpdateUserRepository => {
  class UpdateUserRepositoryStub implements UpdateUserRepository {
    async update(): Promise<UpdateUserRepository.Result> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateUserRepositoryStub();
};

interface SutTypes {
  sut: UpdateUser;
  updateUserRepositoryStub: UpdateUserRepository;
}

const makeSut = (): SutTypes => {
  const updateUserRepositoryStub = makeUpdateUserRepository();

  const sut = new UpdateUser(updateUserRepositoryStub);

  return {
    sut,
    updateUserRepositoryStub,
  };
};

describe('UpdateUser UseCase', () => {
  test('Should call UpdateUserRepository with correct values', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateUserRepositoryStub, 'update');

    await sut.update({
      clientId: '1-abc123',
      bankAccount: '123456',
      digit: '1',
    });

    expect(updateSpy).toHaveBeenCalledWith({
      clientId: '1-abc123',
      bankAccount: '123456',
      digit: '1',
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  test('Should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    jest
      .spyOn(updateUserRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.update({
      clientId: '1-abc123',
      bankAccount: '123456',
      digit: '1',
    });

    await expect(promise).rejects.toThrow();
  });
});
