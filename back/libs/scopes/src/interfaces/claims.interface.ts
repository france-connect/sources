/* istanbul ignore file */

// Declarative code
export type ClaimInterface = string;

export interface ClaimsInterface {
  readonly [key: ClaimInterface]: ClaimInterface;
}
