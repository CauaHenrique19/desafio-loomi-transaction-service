import { FindTransactionByClientIdUseCase } from '@transaction-service/domain/usecases';
import { BuildFindTransactionByClientIdController } from '@transaction-service/main/factories/controllers';
import { FindTransactionByClientIdController } from '@transaction-service/presentation/controllers';

const transaction = [
  {
    id: '1-tx123',
    senderClientId: '1-abc123',
    receiverClientId: '2-def456',
    amount: 100,
    description: 'dasdasdas',
    createdAt: new Date(),
  },
];

const makeCreateFindTransactionById = () => {
  class FindTransactionByClientIdStub
    implements FindTransactionByClientIdUseCase
  {
    async find(): Promise<FindTransactionByClientIdUseCase.Result> {
      return new Promise((resolve) => resolve(transaction));
    }
  }

  return new FindTransactionByClientIdStub();
};

export interface sutTypes {
  sut: FindTransactionByClientIdController;
  findTransactionByClientIdUseCase: FindTransactionByClientIdUseCase;
}

const makeSut = (): sutTypes => {
  const findTransactionByClientIdUseCase = makeCreateFindTransactionById();
  const sut = new FindTransactionByClientIdController(
    findTransactionByClientIdUseCase,
  );

  return {
    sut,
    findTransactionByClientIdUseCase,
  };
};

jest.mock(
  '@transaction-service/main/factories/controllers/transaction/find-transaction-by-clientId.factory.ts',
);

describe('BuildFindTransactionByClientIdController', () => {
  test('Should be able to build the controller correctly', () => {
    const { findTransactionByClientIdUseCase } = makeSut();
    new BuildFindTransactionByClientIdController(
      findTransactionByClientIdUseCase,
    );

    expect(BuildFindTransactionByClientIdController).toHaveBeenCalledWith(
      findTransactionByClientIdUseCase,
    );
  });
});
