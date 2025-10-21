import { UserNotFoundError } from '@transaction-service/domain/errors';
import { FindTransactionByClientIdUseCase } from '@transaction-service/domain/usecases';
import { FindTransactionByClientIdController } from '@transaction-service/presentation/controllers';
import {
  notFound,
  ok,
  serverError,
} from '@transaction-service/presentation/helpers/http-helper';

const fakeTransactions = [
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

const makeFindTransactionByClientIdUseCase =
  (): FindTransactionByClientIdUseCase => {
    class FindTransactionByClientIdUseCaseStub
      implements FindTransactionByClientIdUseCase
    {
      async find(
        parameters: FindTransactionByClientIdUseCase.Parameters,
      ): Promise<FindTransactionByClientIdUseCase.Result> {
        return new Promise((resolve) => resolve(fakeTransactions));
      }
    }

    return new FindTransactionByClientIdUseCaseStub();
  };

interface SutTypes {
  sut: FindTransactionByClientIdController;
  findTransactionByClientIdUseCaseStub: FindTransactionByClientIdUseCase;
}

const makeSut = (): SutTypes => {
  const findTransactionByClientIdUseCaseStub =
    makeFindTransactionByClientIdUseCase();
  const sut = new FindTransactionByClientIdController(
    findTransactionByClientIdUseCaseStub,
  );

  return { sut, findTransactionByClientIdUseCaseStub };
};

describe('FindTransactionByClientIdController', () => {
  test('Should call FindTransactionByClientIdUseCase with correct values', async () => {
    const { sut, findTransactionByClientIdUseCaseStub } = makeSut();
    const spy = jest.spyOn(findTransactionByClientIdUseCaseStub, 'find');

    const params: FindTransactionByClientIdController.Parameters = {
      clientId: 'any_user_id',
    };

    await sut.handle(params);

    expect(spy).toHaveBeenCalledWith(params);
  });

  test('Should return 200 if transactions are found successfully', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ clientId: 'any_user_id' });
    expect(httpResponse).toEqual(ok(fakeTransactions));
  });

  test('Should return 404 if UserNotFoundError is thrown', async () => {
    const { sut, findTransactionByClientIdUseCaseStub } = makeSut();
    const error = new UserNotFoundError();

    jest
      .spyOn(findTransactionByClientIdUseCaseStub, 'find')
      .mockImplementationOnce(() => {
        throw error;
      });

    const httpResponse = await sut.handle({ clientId: 'any_user_id' });
    expect(httpResponse).toEqual(notFound(error));
  });

  test('Should return 500 if FindTransactionByClientIdUseCase throws', async () => {
    const { sut, findTransactionByClientIdUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest
      .spyOn(findTransactionByClientIdUseCaseStub, 'find')
      .mockImplementationOnce(() => {
        throw error;
      });

    const httpResponse = await sut.handle({ clientId: 'any_user_id' });
    expect(httpResponse).toEqual(serverError(error));
  });
});
