import { UserNotFoundError } from '@transaction-service/domain/errors';
import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';
import { CreateTransactionController } from '@transaction-service/presentation/controllers';
import {
  badRequest,
  createdSuccess,
  serverError,
} from '@transaction-service/presentation/helpers/http-helper';

const fakeTransaction = {
  id: '1-tx123',
  senderClientId: '1-abc123',
  receiverClientId: '2-def456',
  amount: 100,
  description: 'dasdasdas',
  createdAt: new Date(),
};

const makeCreateTransactionUseCase = (): CreateTransactionUseCase => {
  class CreateTransactionUseCaseStub implements CreateTransactionUseCase {
    async create(
      parameters: CreateTransactionUseCase.Parameters,
    ): Promise<CreateTransactionUseCase.Result> {
      return new Promise((resolve) => resolve(fakeTransaction));
    }
  }

  return new CreateTransactionUseCaseStub();
};

interface SutTypes {
  sut: CreateTransactionController;
  createTransactionUseCaseStub: CreateTransactionUseCase;
}

const makeSut = (): SutTypes => {
  const createTransactionUseCaseStub = makeCreateTransactionUseCase();
  const sut = new CreateTransactionController(createTransactionUseCaseStub);

  return { sut, createTransactionUseCaseStub };
};

describe('CreateTransactionController', () => {
  test('Should call CreateTransactionUseCase with correct values', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut();
    const spy = jest.spyOn(createTransactionUseCaseStub, 'create');

    const params: CreateTransactionController.Parameters = {
      senderClientId: '1-abc123',
      receiverClientId: '2-def456',
      amount: 100,
      description: 'dasdasdas',
    };

    await sut.handle(params);

    expect(spy).toHaveBeenCalledWith(params);
  });

  test('Should return 201 if transaction is created successfully', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(fakeTransaction);
    expect(httpResponse).toEqual(createdSuccess(fakeTransaction));
  });

  test('Should return 400 if UserNotFoundError is thrown', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut();
    const error = new UserNotFoundError();

    jest
      .spyOn(createTransactionUseCaseStub, 'create')
      .mockImplementationOnce(() => {
        throw error;
      });

    const httpResponse = await sut.handle(fakeTransaction);
    expect(httpResponse).toEqual(badRequest(error));
  });

  test('Should return 500 if CreateTransactionUseCase throws', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest
      .spyOn(createTransactionUseCaseStub, 'create')
      .mockImplementationOnce(() => {
        throw error;
      });

    const httpResponse = await sut.handle(fakeTransaction);
    expect(httpResponse).toEqual(serverError(error));
  });
});
