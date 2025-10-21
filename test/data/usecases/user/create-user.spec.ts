import { CreateUserRepository } from '@transaction-service/data/protocols/db';
import { CreateUser } from '@transaction-service/data/usecases';
import { StatusEnum } from '@transaction-service/domain/enums';
import { UserModel } from '@transaction-service/domain/models';

export const makeFakeUser = (): UserModel => ({
  id: '1-abc123',
  clientId: '1-abc123',
  bankAccount: '123456',
  digit: '1',
  status: StatusEnum.ACTIVE,
  createdAt: new Date(),
});

const fakeUser = makeFakeUser();

const makeCreateUserRepository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async create(): Promise<CreateUserRepository.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }
  return new CreateUserRepositoryStub();
};

interface SutTypes {
  sut: CreateUser;
  createUserRepositoryStub: CreateUserRepository;
}

const makeSut = (): SutTypes => {
  const createUserRepositoryStub = makeCreateUserRepository();
  const sut = new CreateUser(createUserRepositoryStub);
  return {
    sut,
    createUserRepositoryStub,
  };
};

describe('CreateUser UseCase', () => {
  test('Should call CreateUserRepository with correct values', async () => {
    const { sut, createUserRepositoryStub } = makeSut();
    const createSpy = jest.spyOn(createUserRepositoryStub, 'create');

    await sut.create({
      clientId: '1-abc123',
      bankAccount: '123456',
      digit: '1',
    });

    expect(createSpy).toHaveBeenCalled();
  });
});
