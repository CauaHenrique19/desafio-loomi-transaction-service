import { CreateTransaction } from '@transaction-service/data/usecases';
import {
  CreateTransactionRepository,
  FindUsersRepository,
} from '@transaction-service/data/protocols/db';
import { UserNotFoundError } from '@transaction-service/domain/errors';
import { StatusEnum } from '@transaction-service/domain/enums';
import { UserModel } from '@transaction-service/domain/models';
import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';

const makeFakeUser = (): UserModel => ({
  id: '1-abc123',
  clientId: '1-abc123',
  bankAccount: '123456',
  digit: '1',
  status: StatusEnum.ACTIVE,
  createdAt: new Date(),
});

const makeFakeTransaction = (): CreateTransactionUseCase.Result => ({
  id: '1-tx123',
  senderClientId: '1-abc123',
  receiverClientId: '2-def456',
  amount: 100,
  description: 'dasdasdas',
  createdAt: new Date(),
});

const fakeUser = makeFakeUser();
const fakeTransaction = makeFakeTransaction();

const makeFindUsersRepository = (): FindUsersRepository => {
  class FindUsersRepositoryStub implements FindUsersRepository {
    async find(): Promise<FindUsersRepository.Result> {
      return new Promise((resolve) =>
        resolve([fakeUser, { ...fakeUser, clientId: '2-def456' }]),
      );
    }
  }
  return new FindUsersRepositoryStub();
};

const makeCreateTransactionRepository = (): CreateTransactionRepository => {
  class CreateTransactionRepositoryStub implements CreateTransactionRepository {
    async create(): Promise<CreateTransactionRepository.Result> {
      return new Promise((resolve) => resolve(fakeTransaction));
    }
  }
  return new CreateTransactionRepositoryStub();
};

interface SutTypes {
  sut: CreateTransaction;
  findUsersRepositoryStub: FindUsersRepository;
  createTransactionRepositoryStub: CreateTransactionRepository;
}

const makeSut = (): SutTypes => {
  const findUsersRepositoryStub = makeFindUsersRepository();
  const createTransactionRepositoryStub = makeCreateTransactionRepository();
  const sut = new CreateTransaction(
    findUsersRepositoryStub,
    createTransactionRepositoryStub,
  );
  return {
    sut,
    findUsersRepositoryStub,
    createTransactionRepositoryStub,
  };
};

describe('CreateTransaction UseCase', () => {
  test('Should call FindUsersRepository with correct clientIds', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findUsersRepositoryStub, 'find');

    await sut.create({
      senderClientId: '1-abc123',
      receiverClientId: '2-def456',
      description: 'dasdasdas',
      amount: 100,
    });

    expect(findSpy).toHaveBeenCalledWith({
      clientId: ['1-abc123', '2-def456'],
    });
  });

  test('Should throw UserNotFoundError if less than 2 users are found', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    jest
      .spyOn(findUsersRepositoryStub, 'find')
      .mockResolvedValueOnce([fakeUser]);

    await expect(
      sut.create({
        senderClientId: '1-abc123',
        receiverClientId: '2-def456',
        description: 'dasdasdas',
        amount: 100,
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  test('Should call CreateTransactionRepository with correct values', async () => {
    const { sut, createTransactionRepositoryStub } = makeSut();
    const createSpy = jest.spyOn(createTransactionRepositoryStub, 'create');

    const parameters = {
      senderClientId: '1-abc123',
      receiverClientId: '2-def456',
      amount: 100,
      description: 'dasdasdas',
    };

    await sut.create(parameters);

    expect(createSpy).toHaveBeenCalledWith(expect.objectContaining(parameters));
  });

  test('Should return a transaction on success', async () => {
    const { sut } = makeSut();
    const result = await sut.create({
      senderClientId: '1-abc123',
      receiverClientId: '2-def456',
      amount: 100,
      description: 'dasdasdas',
    });

    expect(result).toEqual(fakeTransaction);
  });
});
