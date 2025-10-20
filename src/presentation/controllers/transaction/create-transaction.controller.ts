import { UserNotFoundError } from '@transaction-service/domain/errors';
import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';
import {
  badRequest,
  createdSuccess,
  serverError,
} from '@transaction-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@transaction-service/presentation/protocols';

export class CreateTransactionController implements Controller {
  constructor(private readonly createTransaction: CreateTransactionUseCase) {}

  async handle(
    request: CreateTransactionController.Parameters,
  ): Promise<HttpResponse> {
    try {
      const createdTransaction = await this.createTransaction.create(request);
      return createdSuccess(createdTransaction);
    } catch (error) {
      console.log(error);

      if (error instanceof UserNotFoundError) {
        return badRequest(error);
      }

      return serverError(error);
    }
  }
}

export namespace CreateTransactionController {
  export type Parameters = CreateTransactionUseCase.Parameters;
}
