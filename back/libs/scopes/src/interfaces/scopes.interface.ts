/* istanbul ignore file */

// Declarative code
import { ClaimInterface } from './claims.interface';

export type ScopeInterface = string;

export interface ScopesInterface {
  readonly [key: ScopeInterface]: readonly ClaimInterface[];
}
