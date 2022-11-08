/* istanbul ignore file */

// Declarative code

export type FSAMeta = Record<string, unknown>;

export type FSA<M extends FSAMeta = FSAMeta, P = unknown> = {
  type: string;
  meta?: M;
  payload?: P;
};
