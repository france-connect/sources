type Meta = Record<string, unknown>;
type Payload = unknown;

export type FSAInterface<P = Payload, M extends Meta = Meta> = {
  meta?: M;
  payload?: P;
  type: string;
};
