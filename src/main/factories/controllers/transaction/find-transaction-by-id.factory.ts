import { Inject, Injectable } from '@nestjs/common';

import { Controller } from '@transaction-service/presentation/protocols';
import { FindTransactionByIdUseCase } from '@transaction-service/domain/usecases';
import { FIND_TRANSACTION_BY_ID_FACTORY } from '@transaction-service/main/factories/providers';
import { FindTransactionByIdController } from '@transaction-service/presentation/controllers';

@Injectable()
export class BuildFindTransactionByIdController {
  constructor(
    @Inject(FIND_TRANSACTION_BY_ID_FACTORY)
    private readonly findTransactionById: FindTransactionByIdUseCase,
  ) {}

  public build(): Controller {
    const controller = new FindTransactionByIdController(
      this.findTransactionById,
    );
    return controller;
  }
}
