import { Provider } from '@nestjs/common';
import { RedisAdapter } from '@transaction-service/infra/redis/redis.adapter';

export const CACHE_ADAPTER = 'CACHE_ADAPTER';
export const redisProvider: Provider = {
  provide: CACHE_ADAPTER,
  useClass: RedisAdapter,
};
