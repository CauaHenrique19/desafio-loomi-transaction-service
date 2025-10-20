export type ListenerResponse =
  | {
      processed: true;
    }
  | {
      processed: false;
      error: Error;
    };

export interface Listener<T = any> {
  listen: (request: T) => Promise<ListenerResponse>;
}
