import { UpdateUserUseCase } from '@transaction-service/domain/usecases';

import {
  Listener,
  ListenerResponse,
} from '@transaction-service/presentation/protocols';

export class UpdateUserListener implements Listener {
  constructor(private readonly updateUser: UpdateUserUseCase) {}

  async listen(
    parameters: UpdateUserListener.Parameters,
  ): Promise<ListenerResponse> {
    try {
      await this.updateUser.update({
        clientId: parameters.id,
        bankAccount: parameters.bankAccount,
        digit: parameters.digit,
      });
      return {
        processed: true,
      };
    } catch (error) {
      return {
        error,
        processed: false,
      };
    }
  }
}

export namespace UpdateUserListener {
  export type Parameters = {
    id: string;
    bankAccount: string;
    digit: string;
  };
}
