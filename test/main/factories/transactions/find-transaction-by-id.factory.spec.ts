import { FindTransactionByIdUseCase } from '@transaction-service/domain/usecases';
import { BuildFindTransactionByIdController } from '@transaction-service/main/factories/controllers';
import { FindTransactionByIdController } from '@transaction-service/presentation/controllers';

const transaction = {
  id: '1-tx123',
  senderClientId: '1-abc123',
  receiverClientId: '2-def456',
  amount: 100,
  description: 'dasdasdas',
  createdAt: new Date(),
};

const makeCreateFindTransactionById = () => {
  class FindTransactionByIdStub implements FindTransactionByIdUseCase {
    async find(): Promise<FindTransactionByIdUseCase.Result> {
      return new Promise((resolve) => resolve(transaction));
    }
  }

  return new FindTransactionByIdStub();
};

export interface sutTypes {
  sut: FindTransactionByIdController;
  findTransactionByIdUseCase: FindTransactionByIdUseCase;
}

const makeSut = (): sutTypes => {
  const findTransactionByIdUseCase = makeCreateFindTransactionById();
  const sut = new FindTransactionByIdController(findTransactionByIdUseCase);

  return {
    sut,
    findTransactionByIdUseCase,
  };
};

jest.mock(
  '@transaction-service/main/factories/controllers/transaction/find-transaction-by-id.factory.ts',
);

describe('BuildFindTransactionByIdController', () => {
  test('Should be able to build the controller correctly', () => {
    const { findTransactionByIdUseCase } = makeSut();
    new BuildFindTransactionByIdController(findTransactionByIdUseCase);

    expect(BuildFindTransactionByIdController).toHaveBeenCalledWith(
      findTransactionByIdUseCase,
    );
  });
});
