import Redis from 'ioredis';

import {
  CacheAdapter,
  SetProperties,
} from '@transaction-service/data/protocols/cache';
import { CONFIG } from '@transaction-service/config';

export class RedisAdapter implements CacheAdapter {
  private client: Redis;

  constructor() {
    this.client = new Redis({ port: CONFIG.REDIS_PORT });
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: string,
    properties?: SetProperties,
  ): Promise<void> {
    await this.client.set(key, value, 'EX', properties?.ttl || 0);
  }
}
