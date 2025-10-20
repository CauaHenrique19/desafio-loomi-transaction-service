import { Inject, Injectable } from '@nestjs/common';

import { Listener } from '@transaction-service/presentation/protocols';
import { DeleteUserUseCase } from '@transaction-service/domain/usecases';
import { DELETE_USER_FACTORY } from '@transaction-service/main/factories/providers';
import { DeleteUserListener } from '@transaction-service/presentation/listeners';

@Injectable()
export class BuildDeleteUserListener {
  constructor(
    @Inject(DELETE_USER_FACTORY)
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  public build(): Listener {
    const controller = new DeleteUserListener(this.deleteUser);
    return controller;
  }
}
