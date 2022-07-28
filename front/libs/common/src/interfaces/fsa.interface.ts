/* istanbul ignore file */

// declarative file
type Meta = Record<string, unknown>;
type Payload = unknown;

export type FSA<M extends Meta = Meta, P = Payload> = {
  meta?: M;
  payload?: P;
  type: string;
};
