export interface RmqMessage<T extends object = object> {
  type: string;
  payload: T;
  meta: object;
}
