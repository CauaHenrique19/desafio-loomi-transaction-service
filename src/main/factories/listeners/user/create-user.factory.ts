import { Inject, Injectable } from '@nestjs/common';

import { Listener } from '@transaction-service/presentation/protocols';
import { CreateUserUseCase } from '@transaction-service/domain/usecases';
import { CREATE_USER_FACTORY } from '@transaction-service/main/factories/providers';
import { CreateUserListener } from '@transaction-service/presentation/listeners';

@Injectable()
export class BuildCreateUserListener {
  constructor(
    @Inject(CREATE_USER_FACTORY)
    private readonly createUser: CreateUserUseCase,
  ) {}

  public build(): Listener {
    const controller = new CreateUserListener(this.createUser);
    return controller;
  }
}
