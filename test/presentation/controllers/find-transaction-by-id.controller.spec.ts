import { TransactionNotFoundError } from '@transaction-service/domain/errors';
import { FindTransactionByIdUseCase } from '@transaction-service/domain/usecases';
import { FindTransactionByIdController } from '@transaction-service/presentation/controllers';
import {
  notFound,
  ok,
  serverError,
} from '@transaction-service/presentation/helpers/http-helper';

const fakeTransaction = {
  id: '1-tx123',
  senderClientId: '1-abc123',
  receiverClientId: '2-def456',
  amount: 100,
  description: 'dsadasas',
  createdAt: new Date(),
};

const makeFindTransactionByIdUseCase = (): FindTransactionByIdUseCase => {
  class FindTransactionByIdUseCaseStub implements FindTransactionByIdUseCase {
    async find(
      parameters: FindTransactionByIdUseCase.Parameters,
    ): Promise<FindTransactionByIdUseCase.Result> {
      return new Promise((resolve) => resolve(fakeTransaction));
    }
  }

  return new FindTransactionByIdUseCaseStub();
};

interface SutTypes {
  sut: FindTransactionByIdController;
  findTransactionByIdUseCaseStub: FindTransactionByIdUseCase;
}

const makeSut = (): SutTypes => {
  const findTransactionByIdUseCaseStub = makeFindTransactionByIdUseCase();
  const sut = new FindTransactionByIdController(findTransactionByIdUseCaseStub);

  return { sut, findTransactionByIdUseCaseStub };
};

describe('FindTransactionByIdController', () => {
  test('Should call FindTransactionByIdUseCase with correct values', async () => {
    const { sut, findTransactionByIdUseCaseStub } = makeSut();
    const spy = jest.spyOn(findTransactionByIdUseCaseStub, 'find');

    const params: FindTransactionByIdController.Parameters = { id: 'any_id' };
    await sut.handle(params);

    expect(spy).toHaveBeenCalledWith(params);
  });

  test('Should return 200 if transaction is found successfully', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ id: 'any_id' });
    expect(httpResponse).toEqual(ok(fakeTransaction));
  });

  test('Should return 404 if TransactionNotFoundError is thrown', async () => {
    const { sut, findTransactionByIdUseCaseStub } = makeSut();
    const error = new TransactionNotFoundError();

    jest
      .spyOn(findTransactionByIdUseCaseStub, 'find')
      .mockImplementationOnce(() => {
        throw error;
      });

    const httpResponse = await sut.handle({ id: 'any_id' });
    expect(httpResponse).toEqual(notFound(error));
  });

  test('Should return 500 if FindTransactionByIdUseCase throws', async () => {
    const { sut, findTransactionByIdUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest
      .spyOn(findTransactionByIdUseCaseStub, 'find')
      .mockImplementationOnce(() => {
        throw error;
      });

    const httpResponse = await sut.handle({ id: 'any_id' });
    expect(httpResponse).toEqual(serverError(error));
  });
});
