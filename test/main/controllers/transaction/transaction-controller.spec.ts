import { agent } from 'supertest';
import { Test } from '@nestjs/testing';
import {
  BuildCreateTransactionController,
  BuildFindTransactionByClientIdController,
  BuildFindTransactionByIdController,
} from '@transaction-service/main/factories/controllers';
import {
  TransactionNotFoundError,
  UserNotFoundError,
} from '@transaction-service/domain/errors';
import { makeFakeUser } from 'test/data/usecases/user/create-user.spec';
import {
  CreateTransactionUseCase,
  FindTransactionByIdUseCase,
  FindTransactionByClientIdUseCase,
} from '@transaction-service/domain/usecases';
import { TransactionController } from '@transaction-service/main/controllers/transaction/transaction.controller';
import { CACHE_ADAPTER, RedisAdapter } from '@transaction-service/infra/redis';
import { randomUUID } from 'crypto';

const fakeTransaction = {
  id: '1-tx123',
  senderClientId: '1-abc123',
  receiverClientId: '2-def456',
  amount: 100,
  description: 'dasdasdas',
  createdAt: new Date(),
};

const fakeUser = makeFakeUser();

const makeFindTransactionById = () => {
  class FindTransactionsByIdStub implements FindTransactionByIdUseCase {
    async find(): Promise<FindTransactionByIdUseCase.Result> {
      return new Promise((resolve) => resolve(fakeTransaction));
    }
  }

  return new FindTransactionsByIdStub();
};

const makeFindTransactionByClientId = () => {
  class FindTransactionsByClientIdStub
    implements FindTransactionByClientIdUseCase
  {
    async find(): Promise<FindTransactionByClientIdUseCase.Result> {
      return new Promise((resolve) => resolve([fakeTransaction]));
    }
  }

  return new FindTransactionsByClientIdStub();
};

const makeCreateTransaction = () => {
  class CreateTransactionStub implements CreateTransactionUseCase {
    async create(): Promise<CreateTransactionUseCase.Result> {
      return new Promise((resolve) => resolve(fakeTransaction));
    }
  }

  return new CreateTransactionStub();
};

export interface sutTypes {
  findTransactionById: FindTransactionByIdUseCase;
  createTransactionStub: CreateTransactionUseCase;
  findTransactionByClientId: FindTransactionByClientIdUseCase;
}

const makeSut = (): sutTypes => {
  const findTransactionById = makeFindTransactionById();
  const createTransactionStub = makeCreateTransaction();
  const findTransactionByClientId = makeFindTransactionByClientId();

  return {
    findTransactionById,
    createTransactionStub,
    findTransactionByClientId,
  };
};

const createModule = async (
  findTransactionById: FindTransactionByIdUseCase,
  createTransactionStub: CreateTransactionUseCase,
  findTransactionByClientId: FindTransactionByClientIdUseCase,
) => {
  const module = await Test.createTestingModule({
    controllers: [TransactionController],
    providers: [
      {
        provide: BuildFindTransactionByIdController.name,
        useFactory: () =>
          new BuildFindTransactionByIdController(findTransactionById),
      },
      {
        provide: BuildCreateTransactionController.name,
        useFactory: () =>
          new BuildCreateTransactionController(createTransactionStub),
      },
      {
        provide: BuildFindTransactionByClientIdController.name,
        useFactory: () =>
          new BuildFindTransactionByClientIdController(
            findTransactionByClientId,
          ),
      },
      {
        provide: CACHE_ADAPTER,
        useClass: RedisAdapter,
      },
    ],
  }).compile();

  return module;
};

describe('Transaction (Integration)', () => {
  describe('GET /transactions/:id', () => {
    it('Should return 200 on success', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );
      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .get(`/transactions/${fakeTransaction.id}`)
        .expect(200);
    });

    it('Should return 404 if transaction not found', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );

      jest
        .spyOn(findTransactionById, 'find')
        .mockImplementationOnce(async () => {
          throw new TransactionNotFoundError();
        });

      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .get(`/transactions/non-existing-id`)
        .expect(404);
    });

    it('Should return 500 on generic error', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );

      jest
        .spyOn(findTransactionById, 'find')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .get(`/transactions/${fakeTransaction.id}`)
        .expect(500);
    });
  });

  describe('POST /transactions', () => {
    it('Should return 201 on success', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );
      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .post(`/transactions`)
        .set('idempotency-key', randomUUID())
        .send({
          senderClientId: fakeTransaction.senderClientId,
          receiverClientId: fakeTransaction.receiverClientId,
          amount: fakeTransaction.amount,
          description: fakeTransaction.description,
        })
        .expect(201);
    });

    it('Should return 400 if UserNotFound', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );

      jest
        .spyOn(createTransactionStub, 'create')
        .mockImplementationOnce(async () => {
          throw new UserNotFoundError();
        });

      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .post(`/transactions`)
        .set('idempotency-key', randomUUID())
        .send({
          senderClientId: fakeTransaction.senderClientId,
          receiverClientId: fakeTransaction.receiverClientId,
          amount: fakeTransaction.amount,
          description: fakeTransaction.description,
        })
        .expect(400);
    });

    it('Should return 500 on generic error', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );

      jest
        .spyOn(createTransactionStub, 'create')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .post(`/transactions`)
        .set('idempotency-key', randomUUID())
        .send({
          senderClientId: fakeTransaction.senderClientId,
          receiverClientId: fakeTransaction.receiverClientId,
          amount: fakeTransaction.amount,
          description: fakeTransaction.description,
        })
        .expect(500);
    });
  });

  describe('GET /transactions/user/:id', () => {
    it('Should return 200 on success', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );
      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .get(`/transactions/user/${fakeUser.id}`)
        .expect(200);
    });

    it('Should return 404 if user not found', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );

      jest
        .spyOn(findTransactionByClientId, 'find')
        .mockImplementationOnce(async () => {
          throw new UserNotFoundError();
        });

      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .get(`/transactions/user/non-existing-id`)
        .expect(404);
    });

    it('Should return 500 on generic error', async () => {
      const {
        createTransactionStub,
        findTransactionByClientId,
        findTransactionById,
      } = makeSut();
      const module = await createModule(
        findTransactionById,
        createTransactionStub,
        findTransactionByClientId,
      );

      jest
        .spyOn(findTransactionByClientId, 'find')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .get(`/transactions/user/${fakeUser.id}`)
        .expect(500);
    });
  });
});
