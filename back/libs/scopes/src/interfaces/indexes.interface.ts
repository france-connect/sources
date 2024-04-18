import { ClaimInterface } from './claims.interface';
import { RichClaimInterface } from './rich-claim.interface';
import { ScopeInterface } from './scopes.interface';

export type ClaimIndexInterface = Map<ClaimInterface, RichClaimInterface>;
export type ScopeIndexInterface = Map<ScopeInterface, ClaimInterface[]>;
