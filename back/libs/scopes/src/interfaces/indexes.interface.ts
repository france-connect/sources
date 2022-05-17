import { IClaim } from './claims.interface';
import { IRichClaim } from './rich-claim.interface';
import { IScope } from './scopes.interface';

export type IClaimIndex = Map<IClaim, IRichClaim>;
export type IScopeIndex = Map<IScope, IClaim[]>;
