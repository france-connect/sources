import { ClaimInterface } from './claims.interface';
import { ProviderInterface } from './provider-mapping.interface';

export interface RichClaimInterface {
  identifier: ClaimInterface;
  label?: string;
  provider: ProviderInterface;
}

export interface RichClaimsInterface {
  readonly [key: ClaimInterface]: RichClaimInterface;
}
