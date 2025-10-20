import { CreateUserUseCase } from '@transaction-service/domain/usecases';
import {
  Listener,
  ListenerResponse,
} from '@transaction-service/presentation/protocols';

export class CreateUserListener implements Listener {
  constructor(private readonly createUser: CreateUserUseCase) {}

  async listen(
    parameters: CreateUserListener.Parameters,
  ): Promise<ListenerResponse> {
    try {
      await this.createUser.create({
        clientId: parameters.id,
        bankAccount: parameters.bankAccount,
        digit: parameters.digit,
      });
      return {
        processed: true,
      };
    } catch (error) {
      return {
        processed: false,
        error,
      };
    }
  }
}

export namespace CreateUserListener {
  export type Parameters = {
    id: string;
    address: string;
    bankAccount: string;
    digit: string;
  };
}
