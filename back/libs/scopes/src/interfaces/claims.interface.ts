/* istanbul ignore file */

// Declarative code
export type IClaim = string;

export interface IClaims {
  readonly [key: IClaim]: IClaim;
}
