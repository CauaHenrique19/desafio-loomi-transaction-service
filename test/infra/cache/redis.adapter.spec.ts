import { Redis } from 'ioredis';

import { RedisAdapter } from '@transaction-service/infra/redis';
import { SetProperties } from '@transaction-service/data/protocols/cache';

jest.mock('ioredis', () => require('ioredis-mock'));

describe('RedisAdapter', () => {
  let redisAdapter: RedisAdapter;
  let mockClient: Redis;

  beforeEach(() => {
    redisAdapter = new RedisAdapter();
    mockClient = redisAdapter.client;
  });

  afterEach(async () => {
    await mockClient.flushall();
    await mockClient.quit();
  });

  describe('set()', () => {
    it('deve salvar um valor no Redis sem TTL', async () => {
      const key = 'test-key';
      const value = 'test-value';

      await redisAdapter.set(key, value);

      const stored = await mockClient.get(key);
      expect(stored).toBe(value);
    });

    it('deve salvar um valor no Redis com TTL', async () => {
      const key = 'test-key-ttl';
      const value = 'expiring';
      const ttlSeconds = 2;

      const properties: SetProperties = { ttl: ttlSeconds };
      const setSpy = jest.spyOn(mockClient, 'set');

      await redisAdapter.set(key, value, properties);

      expect(setSpy).toHaveBeenCalledWith(key, value, 'EX', ttlSeconds);
      const stored = await mockClient.get(key);
      expect(stored).toBe(value);
    });
  });

  describe('get()', () => {
    it('deve retornar o valor salvo', async () => {
      const key = 'existent';
      const value = 'stored-value';

      await mockClient.set(key, value);
      const result = await redisAdapter.get(key);

      expect(result).toBe(value);
    });

    it('deve retornar null para chave inexistente', async () => {
      const result = await redisAdapter.get('missing-key');
      expect(result).toBeNull();
    });
  });
});
