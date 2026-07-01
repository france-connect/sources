import type { AnyObjectInterface } from './any-object.interface';

export type FSAInterface<P = unknown, M = AnyObjectInterface> = {
  meta?: M;
  payload?: P;
  type: string;
};
