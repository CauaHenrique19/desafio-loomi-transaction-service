import { UserNotFoundError } from '@transaction-service/domain/errors';
import { FindTransactionByClientIdUseCase } from '@transaction-service/domain/usecases';
import {
  notFound,
  ok,
  serverError,
} from '@transaction-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@transaction-service/presentation/protocols';

export class FindTransactionByClientIdController implements Controller {
  constructor(
    private readonly findTransactionByClientIdUseCase: FindTransactionByClientIdUseCase,
  ) {}

  async handle(
    request: FindTransactionByClientIdController.Parameters,
  ): Promise<HttpResponse> {
    try {
      const transactions =
        await this.findTransactionByClientIdUseCase.find(request);
      return ok(transactions);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return serverError(error);
    }
  }
}

export namespace FindTransactionByClientIdController {
  export type Parameters = FindTransactionByClientIdUseCase.Parameters;
}
