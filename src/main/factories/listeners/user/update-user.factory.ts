import { Inject, Injectable } from '@nestjs/common';

import { Listener } from '@transaction-service/presentation/protocols';
import { UpdateUserUseCase } from '@transaction-service/domain/usecases';
import { UPDATE_USER_FACTORY } from '@transaction-service/main/factories/providers';
import { UpdateUserListener } from '@transaction-service/presentation/listeners';

@Injectable()
export class BuildUpdateUserListener {
  constructor(
    @Inject(UPDATE_USER_FACTORY)
    private readonly updateUser: UpdateUserUseCase,
  ) {}

  public build(): Listener {
    const controller = new UpdateUserListener(this.updateUser);
    return controller;
  }
}
