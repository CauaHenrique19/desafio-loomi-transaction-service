import { DeleteUserUseCase } from '@transaction-service/domain/usecases';

import {
  Listener,
  ListenerResponse,
} from '@transaction-service/presentation/protocols';

export class DeleteUserListener implements Listener {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  async listen(
    parameters: DeleteUserListener.Parameters,
  ): Promise<ListenerResponse> {
    try {
      await this.deleteUserUseCase.delete({
        clientId: parameters.id,
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

export namespace DeleteUserListener {
  export type Parameters = {
    id: string;
  };
}
