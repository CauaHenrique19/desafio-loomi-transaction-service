import {
  Listener,
  ListenerResponse,
} from '@transaction-service/presentation/protocols';

export const listenerAdapter = async (
  controller: Listener,
  request?: any,
): Promise<ListenerResponse> => {
  return controller.listen(request);
};
