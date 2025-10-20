import { Inject, Injectable } from '@nestjs/common';

import { Controller } from '@transaction-service/presentation/protocols';
import { FindTransactionByClientIdUseCase } from '@transaction-service/domain/usecases';
import { FIND_TRANSACTION_BY_CLIENT_ID_FACTORY } from '@transaction-service/main/factories/providers';
import { FindTransactionByClientIdController } from '@transaction-service/presentation/controllers';

@Injectable()
export class BuildFindTransactionByClientIdController {
  constructor(
    @Inject(FIND_TRANSACTION_BY_CLIENT_ID_FACTORY)
    private readonly findTransactionByClientIdUseCase: FindTransactionByClientIdUseCase,
  ) {}

  public build(): Controller {
    const controller = new FindTransactionByClientIdController(
      this.findTransactionByClientIdUseCase,
    );
    return controller;
  }
}
