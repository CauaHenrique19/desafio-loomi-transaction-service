import { FindTransactionByClientId } from '@transaction-service/data/usecases';
import { CacheAdapter } from '@transaction-service/data/protocols/cache';
import {
  FindTransactionByClientIdRepository,
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

const makeFakeTransactions = (): CreateTransactionUseCase.Result[] => [
  {
    id: '1-tx123',
    senderClientId: '1-abc123',
    receiverClientId: '2-def456',
    amount: 100,
    description: 'dsadasas',
    createdAt: new Date(),
  },
  {
    id: '2-tx456',
    senderClientId: '3-ghi789',
    receiverClientId: '1-abc123',
    amount: 200,
    description: 'dsadasas',
    createdAt: new Date(),
  },
];

const fakeUser = makeFakeUser();
const fakeTransactions = makeFakeTransactions();

const makeCacheAdapter = (): CacheAdapter => {
  class CacheAdapterStub implements CacheAdapter {
    async get(): Promise<string | null> {
      return new Promise((resolve) => resolve(null));
    }

    async set(): Promise<void> {
      return new Promise((resolve) => resolve());
    }

    async delete(): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new CacheAdapterStub();
};

const makeFindUsersRepository = (): FindUsersRepository => {
  class FindUsersRepositoryStub implements FindUsersRepository {
    async find(): Promise<FindUsersRepository.Result> {
      return new Promise((resolve) => resolve([fakeUser]));
    }
  }
  return new FindUsersRepositoryStub();
};

const makeFindTransactionByClientIdRepository =
  (): FindTransactionByClientIdRepository => {
    class FindTransactionByClientIdRepositoryStub
      implements FindTransactionByClientIdRepository
    {
      async findByClientId(): Promise<FindTransactionByClientIdRepository.Result> {
        return new Promise((resolve) => resolve(fakeTransactions));
      }
    }
    return new FindTransactionByClientIdRepositoryStub();
  };

interface SutTypes {
  sut: FindTransactionByClientId;
  cacheAdapterStub: CacheAdapter;
  findUsersRepositoryStub: FindUsersRepository;
  findTransactionByClientIdRepositoryStub: FindTransactionByClientIdRepository;
}

const makeSut = (): SutTypes => {
  const cacheAdapterStub = makeCacheAdapter();
  const findUsersRepositoryStub = makeFindUsersRepository();
  const findTransactionByClientIdRepositoryStub =
    makeFindTransactionByClientIdRepository();
  const sut = new FindTransactionByClientId(
    cacheAdapterStub,
    findUsersRepositoryStub,
    findTransactionByClientIdRepositoryStub,
  );
  return {
    sut,
    cacheAdapterStub,
    findUsersRepositoryStub,
    findTransactionByClientIdRepositoryStub,
  };
};

describe('FindTransactionByClientId UseCase', () => {
  test('Should call CacheAdapter.get with correct key', async () => {
    const { sut, cacheAdapterStub } = makeSut();
    const getSpy = jest.spyOn(cacheAdapterStub, 'get');

    await sut.find({ clientId: '1-abc123' });

    expect(getSpy).toHaveBeenCalledWith('client-transactions:1-abc123');
  });

  test('Should return transactions from cache if they exist', async () => {
    const { sut, cacheAdapterStub } = makeSut();

    const transactions = JSON.stringify(fakeTransactions);
    jest.spyOn(cacheAdapterStub, 'get').mockResolvedValueOnce(transactions);

    const result = await sut.find({ clientId: '1-abc123' });

    expect(result).toEqual(JSON.parse(transactions));
  });

  test('Should call FindUsersRepository.find if cache is empty', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findUsersRepositoryStub, 'find');

    await sut.find({ clientId: '1-abc123' });

    expect(findSpy).toHaveBeenCalledWith({ clientId: '1-abc123' });
  });

  test('Should throw UserNotFoundError if user does not exist', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    jest.spyOn(findUsersRepositoryStub, 'find').mockResolvedValueOnce([]);

    await expect(sut.find({ clientId: '1-abc123' })).rejects.toThrow(
      UserNotFoundError,
    );
  });

  test('Should call FindTransactionByClientIdRepository.findByClientId with correct values', async () => {
    const { sut, findTransactionByClientIdRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(
      findTransactionByClientIdRepositoryStub,
      'findByClientId',
    );

    await sut.find({ clientId: '1-abc123' });

    expect(findSpy).toHaveBeenCalledWith({ clientId: '1-abc123' });
  });

  test('Should call CacheAdapter.set with correct values after fetching from DB', async () => {
    const { sut, cacheAdapterStub } = makeSut();
    const setSpy = jest.spyOn(cacheAdapterStub, 'set');

    await sut.find({ clientId: '1-abc123' });

    expect(setSpy).toHaveBeenCalledWith(
      'client-transactions:1-abc123',
      JSON.stringify(fakeTransactions),
    );
  });

  test('Should return transactions on success', async () => {
    const { sut } = makeSut();

    const result = await sut.find({ clientId: '1-abc123' });

    expect(result).toEqual(fakeTransactions);
  });
});
