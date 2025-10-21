import { Test } from '@nestjs/testing';
import { KafkaContext } from '@nestjs/microservices';
import { UserController } from '@transaction-service/main/controllers/user/user.controller';
import {
  BuildCreateUserListener,
  BuildUpdateUserListener,
  BuildDeleteUserListener,
} from '@transaction-service/main/factories/listeners';
import {
  handleCommitOffsetKafka,
  handleRetryKafka,
} from '@transaction-service/main/utils';
import { listenerAdapter } from '@transaction-service/main/adapters/listener.adapter';
import { randomUUID } from 'crypto';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase,
} from '@transaction-service/domain/usecases';
import { makeFakeUser } from 'test/data/usecases/user/create-user.spec';

jest.mock('@transaction-service/main/adapters/listener.adapter');
jest.mock('@transaction-service/main/utils');

const fakeUser = makeFakeUser()[0];

const makeCreateUser = () => {
  class CreateUsersStub implements CreateUserUseCase {
    async create(): Promise<CreateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new CreateUsersStub();
};

const makeUpdateUser = () => {
  class UpdateUsersStub implements UpdateUserUseCase {
    async update(): Promise<UpdateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdateUsersStub();
};

const makeDeleteUser = () => {
  class DeleteUsersStub implements DeleteUserUseCase {
    async delete(): Promise<DeleteUserUseCase.Result> {
      return new Promise((resolve) => resolve());
    }
  }

  return new DeleteUsersStub();
};

export interface sutTypes {
  createUserUseCaseStub: CreateUserUseCase;
  updateUserUseCaseStub: UpdateUserUseCase;
  deleteUserUseCaseStub: DeleteUserUseCase;
}

const makeSut = (): sutTypes => {
  const createUserUseCaseStub = makeCreateUser();
  const updateUserUseCaseStub = makeUpdateUser();
  const deleteUserUseCaseStub = makeDeleteUser();

  return {
    createUserUseCaseStub,
    updateUserUseCaseStub,
    deleteUserUseCaseStub,
  };
};

describe('UserController (Kafka)', () => {
  let sut: UserController;

  const kafkaContext = {
    getMessage: jest.fn(),
    getTopic: jest.fn(),
    getPartition: jest.fn(),
    getConsumer: jest.fn(),
  } as unknown as KafkaContext;

  beforeAll(async () => {
    const {
      createUserUseCaseStub,
      updateUserUseCaseStub,
      deleteUserUseCaseStub,
    } = makeSut();
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: BuildCreateUserListener.name,
          useFactory: () => new BuildCreateUserListener(createUserUseCaseStub),
        },
        {
          provide: BuildUpdateUserListener.name,
          useFactory: () => new BuildUpdateUserListener(updateUserUseCaseStub),
        },
        {
          provide: BuildDeleteUserListener.name,
          useFactory: () => new BuildDeleteUserListener(deleteUserUseCaseStub),
        },
      ],
    }).compile();

    sut = moduleRef.get(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create (created_user)', () => {
    it('deve chamar handleCommitOffsetKafka quando o processamento for bem-sucedido', async () => {
      jest.mocked(listenerAdapter).mockResolvedValueOnce({ processed: true });

      await sut.create(
        { id: randomUUID(), bankAccount: '123456', digit: '1' },
        kafkaContext,
      );

      expect(handleCommitOffsetKafka).toHaveBeenCalledWith(kafkaContext);
      expect(handleRetryKafka).not.toHaveBeenCalled();
    });

    it('deve chamar handleRetryKafka quando houver erro de processamento', async () => {
      const error = new Error('Erro de processamento');
      jest
        .mocked(listenerAdapter)
        .mockResolvedValueOnce({ processed: false, error });

      await sut.create(
        { id: randomUUID(), bankAccount: '123456', digit: '1' },
        kafkaContext,
      );

      expect(handleRetryKafka).toHaveBeenCalledWith(
        kafkaContext,
        error,
        expect.anything(),
      );
      expect(handleCommitOffsetKafka).not.toHaveBeenCalled();
    });
  });

  describe('update (updated_user)', () => {
    it('deve chamar handleCommitOffsetKafka quando o processamento for bem-sucedido', async () => {
      jest.mocked(listenerAdapter).mockResolvedValueOnce({ processed: true });

      await sut.update(
        { id: randomUUID(), bankAccount: '123456', digit: '1' },
        kafkaContext,
      );

      expect(handleCommitOffsetKafka).toHaveBeenCalledWith(kafkaContext);
    });

    it('deve chamar handleRetryKafka quando houver erro de processamento', async () => {
      const error = new Error('Erro de processamento');
      jest
        .mocked(listenerAdapter)
        .mockResolvedValueOnce({ processed: false, error });

      await sut.update(
        { id: randomUUID(), bankAccount: '123456', digit: '1' },
        kafkaContext,
      );

      expect(handleRetryKafka).toHaveBeenCalledWith(
        kafkaContext,
        error,
        expect.anything(),
      );
    });
  });

  describe('delete (deleted_user)', () => {
    it('deve chamar handleCommitOffsetKafka quando o processamento for bem-sucedido', async () => {
      jest.mocked(listenerAdapter).mockResolvedValueOnce({ processed: true });

      await sut.delete({ id: randomUUID() }, kafkaContext);

      expect(handleCommitOffsetKafka).toHaveBeenCalledWith(kafkaContext);
    });

    it('deve chamar handleRetryKafka quando houver erro de processamento', async () => {
      const error = new Error('Erro de processamento');
      jest
        .mocked(listenerAdapter)
        .mockResolvedValueOnce({ processed: false, error });

      await sut.delete({ id: randomUUID() }, kafkaContext);

      expect(handleRetryKafka).toHaveBeenCalledWith(
        kafkaContext,
        error,
        expect.anything(),
      );
    });
  });
});
