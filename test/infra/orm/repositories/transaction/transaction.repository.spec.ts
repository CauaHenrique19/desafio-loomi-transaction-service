import {
  TransactionRepository,
  UserRepository,
} from '@transaction-service/infra/orm/repositories';
import { Transaction, User } from '@transaction-service/infra/orm/entities';
import { AppDataSource } from '@transaction-service/infra/orm/typeorm/data-source';
import {
  CreateTransactionRepository,
  CreateUserRepository,
} from '@transaction-service/data/protocols/db';
import { randomUUID } from 'crypto';
import { StatusEnum } from '@transaction-service/domain/enums';

interface SutTypes {
  sut: TransactionRepository;
  userRepository: UserRepository;
}

describe('TransactionRepository', () => {
  let dataSource: typeof AppDataSource;

  beforeAll(async () => {
    dataSource = AppDataSource;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  const makeSut = (): SutTypes => {
    const sut = new TransactionRepository(Transaction);
    const userRepository = new UserRepository(User);

    return {
      sut,
      userRepository,
    };
  };

  describe('create()', () => {
    test('Should create a new transaction', async () => {
      const { sut, userRepository } = makeSut();

      const senderClientId = randomUUID();
      const senderClient: CreateUserRepository.Parameters = {
        clientId: senderClientId,
        bankAccount: '123456',
        digit: '1',
        status: StatusEnum.ACTIVE,
        createdAt: new Date(),
      };

      const receiverClientId = randomUUID();
      const receiverClient: CreateUserRepository.Parameters = {
        clientId: receiverClientId,
        bankAccount: '123456',
        digit: '1',
        status: StatusEnum.ACTIVE,
        createdAt: new Date(),
      };

      await userRepository.create(senderClient);
      await userRepository.create(receiverClient);

      const newTransaction: CreateTransactionRepository.Parameters = {
        senderClientId,
        receiverClientId,
        description: 'asdasdas',
        amount: 150,
        createdAt: new Date(),
      };

      const transaction = await sut.create(newTransaction);

      expect(transaction).toBeTruthy();
      expect(transaction.amount).toBe(newTransaction.amount);
    });
  });

  describe('findById()', () => {
    test('Should return null if transaction does not exist', async () => {
      const { sut } = makeSut();

      jest.spyOn(sut, 'findById').mockResolvedValueOnce(null);

      const transaction = await sut.findById({ id: randomUUID() });

      expect(transaction).toBeNull();
    });

    test('Should return transaction if exists', async () => {
      const { sut, userRepository } = makeSut();

      const senderClientId = randomUUID();
      const senderClient: CreateUserRepository.Parameters = {
        clientId: senderClientId,
        bankAccount: '123456',
        digit: '1',
        status: StatusEnum.ACTIVE,
        createdAt: new Date(),
      };

      const receiverClientId = randomUUID();
      const receiverClient: CreateUserRepository.Parameters = {
        clientId: receiverClientId,
        bankAccount: '123456',
        digit: '1',
        status: StatusEnum.ACTIVE,
        createdAt: new Date(),
      };

      await userRepository.create(senderClient);
      await userRepository.create(receiverClient);

      const newTransaction: CreateTransactionRepository.Parameters = {
        senderClientId,
        receiverClientId,
        description: 'asdasdas',
        amount: 150,
        createdAt: new Date(),
      };

      const createdTransaction = await sut.create(newTransaction);

      const transaction = await sut.findById({ id: createdTransaction.id });
      expect(transaction!.id).toEqual(createdTransaction.id);
    });
  });

  describe('findByClientId()', () => {
    test('Should return an array of transactions where client is sender or receiver', async () => {
      const { sut } = makeSut();

      const clientId = randomUUID();

      const transactions = await sut.findByClientId({ clientId });

      expect(transactions).toBeTruthy();
      expect(transactions.length).toBeGreaterThanOrEqual(0);
      expect(
        transactions.every(
          (tx) =>
            tx.senderClientId === clientId || tx.receiverClientId === clientId,
        ),
      ).toBe(true);
    });
  });
});
