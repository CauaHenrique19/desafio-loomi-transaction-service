import { DeleteUserRepository } from '@transaction-service/data/protocols/db';
import { DeleteUser } from '@transaction-service/data/usecases';

const makeDeleteUserRepository = (): DeleteUserRepository => {
  class DeleteUserRepositoryStub implements DeleteUserRepository {
    async delete(): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new DeleteUserRepositoryStub();
};

interface SutTypes {
  sut: DeleteUser;
  deleteUserRepositoryStub: DeleteUserRepository;
}

const makeSut = (): SutTypes => {
  const deleteUserRepositoryStub = makeDeleteUserRepository();
  const sut = new DeleteUser(deleteUserRepositoryStub);

  return {
    sut,
    deleteUserRepositoryStub,
  };
};

describe('DeleteUser UseCase', () => {
  test('Should call DeleteUserRepository with correct values', async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteUserRepositoryStub, 'delete');

    await sut.delete({ clientId: '1-abc123' });

    expect(deleteSpy).toHaveBeenCalledWith({ clientId: '1-abc123' });
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
