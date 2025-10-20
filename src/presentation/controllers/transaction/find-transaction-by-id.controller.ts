import { TransactionNotFoundError } from '@transaction-service/domain/errors';
import { FindTransactionByIdUseCase } from '@transaction-service/domain/usecases';
import {
  notFound,
  ok,
  serverError,
} from '@transaction-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@transaction-service/presentation/protocols';

export class FindTransactionByIdController implements Controller {
  constructor(
    private readonly findTransactionById: FindTransactionByIdUseCase,
  ) {}

  async handle(
    request: FindTransactionByIdController.Parameters,
  ): Promise<HttpResponse> {
    try {
      const transaction = await this.findTransactionById.find(request);
      return ok(transaction);
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        return notFound(error);
      }

      return serverError(error);
    }
  }
}

export namespace FindTransactionByIdController {
  export type Parameters = FindTransactionByIdUseCase.Parameters;
}
