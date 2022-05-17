/* istanbul ignore file */

// Declarative code
import { IClaim } from './claims.interface';
import { IProvider } from './provider-mapping.interface';

export interface IRichClaim {
  identifier: IClaim;
  label: string;
  provider: IProvider;
}

export interface IRichClaims {
  readonly [key: IClaim]: IRichClaim;
}
