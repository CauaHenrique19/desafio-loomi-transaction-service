import { Inject, Injectable } from '@nestjs/common';

import { Controller } from '@transaction-service/presentation/protocols';
import { CreateTransactionUseCase } from '@transaction-service/domain/usecases';
import { CREATE_TRANSACTION_FACTORY } from '@transaction-service/main/factories/providers';
import { CreateTransactionController } from '@transaction-service/presentation/controllers';

@Injectable()
export class BuildCreateTransactionController {
  constructor(
    @Inject(CREATE_TRANSACTION_FACTORY)
    private readonly createUser: CreateTransactionUseCase,
  ) {}

  public build(): Controller {
    const controller = new CreateTransactionController(this.createUser);
    return controller;
  }
}
