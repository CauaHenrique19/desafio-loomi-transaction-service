import { FindTransactionById } from '@transaction-service/data/usecases';
import { CacheAdapter } from '@transaction-service/data/protocols/cache';
import { FindTransactionByIdRepository } from '@transaction-service/data/protocols/db';
import { TransactionNotFoundError } from '@transaction-service/domain/errors';
import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';

const makeFakeTransaction = (): CreateTransactionUseCase.Result => ({
  id: '1-tx123',
  senderClientId: '1-abc123',
  receiverClientId: '2-def456',
  amount: 100,
  description: 'dasdasdas',
  createdAt: new Date(),
});

const fakeTransaction = makeFakeTransaction();

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

const makeFindTransactionByIdRepository = (): FindTransactionByIdRepository => {
  class FindTransactionByIdRepositoryStub
    implements FindTransactionByIdRepository
  {
    async findById(): Promise<FindTransactionByIdRepository.Result> {
      return new Promise((resolve) => resolve(fakeTransaction));
    }
  }
  return new FindTransactionByIdRepositoryStub();
};

interface SutTypes {
  sut: FindTransactionById;
  cacheAdapterStub: CacheAdapter;
  findTransactionByIdRepositoryStub: FindTransactionByIdRepository;
}

const makeSut = (): SutTypes => {
  const cacheAdapterStub = makeCacheAdapter();
  const findTransactionByIdRepositoryStub = makeFindTransactionByIdRepository();
  const sut = new FindTransactionById(
    cacheAdapterStub,
    findTransactionByIdRepositoryStub,
  );
  return {
    sut,
    cacheAdapterStub,
    findTransactionByIdRepositoryStub,
  };
};

describe('FindTransactionById UseCase', () => {
  test('Should call CacheAdapter.get with correct key', async () => {
    const { sut, cacheAdapterStub } = makeSut();
    const getSpy = jest.spyOn(cacheAdapterStub, 'get');

    await sut.find({ id: '1-tx123' });

    expect(getSpy).toHaveBeenCalledWith('transaction:1-tx123');
  });

  test('Should return transaction from cache if it exists', async () => {
    const { sut, cacheAdapterStub } = makeSut();

    const transaction = JSON.stringify(fakeTransaction);
    jest.spyOn(cacheAdapterStub, 'get').mockResolvedValueOnce(transaction);

    const result = await sut.find({ id: '1-tx123' });

    expect(result).toEqual(JSON.parse(transaction));
  });

  test('Should call FindTransactionByIdRepository.findById if transaction not in cache', async () => {
    const { sut, findTransactionByIdRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findTransactionByIdRepositoryStub, 'findById');

    await sut.find({ id: '1-tx123' });

    expect(findSpy).toHaveBeenCalledWith({ id: '1-tx123' });
  });

  test('Should throw TransactionNotFoundError if repository returns null', async () => {
    const { sut, findTransactionByIdRepositoryStub } = makeSut();
    jest
      .spyOn(findTransactionByIdRepositoryStub, 'findById')
      .mockResolvedValueOnce(null);

    await expect(sut.find({ id: '1-tx123' })).rejects.toThrow(
      TransactionNotFoundError,
    );
  });

  test('Should call CacheAdapter.set with correct values when transaction is found', async () => {
    const { sut, cacheAdapterStub } = makeSut();
    const setSpy = jest.spyOn(cacheAdapterStub, 'set');

    await sut.find({ id: '1-tx123' });

    expect(setSpy).toHaveBeenCalledWith(
      'transaction:1-tx123',
      JSON.stringify(fakeTransaction),
    );
  });

  test('Should return transaction on success', async () => {
    const { sut } = makeSut();
    const result = await sut.find({ id: '1-tx123' });

    expect(result).toEqual(fakeTransaction);
  });
});
