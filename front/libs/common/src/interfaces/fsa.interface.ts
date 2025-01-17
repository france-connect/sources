type Meta = Record<string, unknown>;
type Payload = unknown;

export type FSAInterface<M extends Meta = Meta, P = Payload> = {
  meta?: M;
  payload?: P;
  type: string;
};
