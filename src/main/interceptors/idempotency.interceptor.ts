import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheAdapter } from '@transaction-service/data/protocols/cache';
import { CACHE_ADAPTER } from '@transaction-service/infra/redis';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_ADAPTER) private readonly cacheAdapter: CacheAdapter,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['idempotency-key'];

    if (!key) {
      throw new BadRequestException(
        "Header 'idempotency-key' is required for this request.",
      );
    }

    const cachedResponse = await this.cacheAdapter.get(key);
    if (cachedResponse) {
      throw new ConflictException('Transaction already processed');
    }

    return next.handle().pipe(
      tap(async () => {
        await this.cacheAdapter.set(key, key, { ttl: 3600 });
      }),
    );
  }
}
