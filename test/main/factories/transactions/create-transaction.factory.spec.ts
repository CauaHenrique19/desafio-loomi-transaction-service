import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';
import { BuildCreateTransactionController } from '@transaction-service/main/factories/controllers';
import { CreateTransactionController } from '@transaction-service/presentation/controllers';

const transaction = {
  id: '1-tx123',
  senderClientId: '1-abc123',
  receiverClientId: '2-def456',
  amount: 100,
  description: 'dasdasdas',
  createdAt: new Date(),
};

const makeCreateTransaction = () => {
  class CreateTransactionStub implements CreateTransactionUseCase {
    async create(): Promise<CreateTransactionUseCase.Result> {
      return new Promise((resolve) => resolve(transaction));
    }
  }

  return new CreateTransactionStub();
};

export interface sutTypes {
  sut: CreateTransactionController;
  createTransactionStub: CreateTransactionUseCase;
}

const makeSut = (): sutTypes => {
  const createTransactionStub = makeCreateTransaction();
  const sut = new CreateTransactionController(createTransactionStub);

  return {
    sut,
    createTransactionStub,
  };
};

jest.mock(
  '@transaction-service/main/factories/controllers/transaction/create-transaction.factory.ts',
);

describe('BuildCreateTransactionController', () => {
  test('Should be able to build the controller correctly', () => {
    const { createTransactionStub } = makeSut();
    new BuildCreateTransactionController(createTransactionStub);

    expect(BuildCreateTransactionController).toHaveBeenCalledWith(
      createTransactionStub,
    );
  });
});
