/* istanbul ignore file */

// Declarative code
import { IClaim } from './claims.interface';

export type IScope = string;

export interface IScopes {
  readonly [key: IScope]: readonly IClaim[];
}
