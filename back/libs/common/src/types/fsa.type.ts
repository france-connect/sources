/* istanbul ignore file */

// Declarative code

export type FSA<
  M extends Record<string, unknown> = Record<string, unknown>,
  P = unknown,
> = {
  type: string;
  meta?: M;
  payload?: P;
};
