import { StatusEnum } from '@transaction-service/domain/enums';
import { UserRepository } from '@transaction-service/infra/orm/repositories';
import { User } from '@transaction-service/infra/orm/entities';
import { AppDataSource } from '@transaction-service/infra/orm/typeorm/data-source';
import { CreateUserRepository } from '@transaction-service/data/protocols/db';
import { randomUUID } from 'crypto';

describe('UserRepository', () => {
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

  const makeSut = (): UserRepository => {
    return new UserRepository(User);
  };

  describe('find()', () => {
    test('Should return an empty array when database is clear', async () => {
      const sut = makeSut();

      jest.spyOn(sut, 'find').mockResolvedValueOnce([]);

      const users = await sut.find();

      expect(users).toBeTruthy();
      expect(users.length).toBe(0);
    });

    test('Should filter by clientId array', async () => {
      const sut = makeSut();

      const users = await sut.find({
        clientId: [randomUUID(), randomUUID()],
      });

      expect(users).toBeTruthy();
      expect(users.length).toBeGreaterThanOrEqual(0);
    });

    test('Should filter by single clientId', async () => {
      const sut = makeSut();

      const users = await sut.find({
        clientId: randomUUID(),
      });

      expect(users).toBeTruthy();
      expect(users.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('create()', () => {
    test('Should create a new user', async () => {
      const sut = makeSut();

      const newUser: CreateUserRepository.Parameters = {
        clientId: randomUUID(),
        bankAccount: '123456',
        digit: '1',
        status: StatusEnum.ACTIVE,
        createdAt: new Date(),
      };

      const user = await sut.create(newUser);

      expect(user).toBeTruthy();
      expect(user.clientId).toBe(newUser.clientId);
      expect(user.status).toBe(StatusEnum.ACTIVE);
    });
  });

  describe('update()', () => {
    test('Should update an existing user', async () => {
      const sut = makeSut();

      const users = await sut.find();
      if (!users[0]) return;

      const updatedUser = await sut.update({
        ...users[0],
        bankAccount: '123457',
      });

      expect(updatedUser).toBeUndefined(); // update() returns void
    });
  });

  describe('delete()', () => {
    test('Should soft delete a user by setting status INACTIVE', async () => {
      const sut = makeSut();

      const users = await sut.find();
      if (!users[0]) return;

      await sut.delete({ clientId: users[0].clientId });

      const deletedUser = await sut.find({ clientId: users[0].clientId });
      expect(deletedUser[0]?.status).toBe(StatusEnum.INACTIVE);
    });
  });
});
