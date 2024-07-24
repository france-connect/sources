import { ClaimsInterface } from './claims.interface';
import { ScopesInterface } from './scopes.interface';

export interface ProviderInterface {
  slug: string;
  label: string;
}

export interface ProviderMappingsInterface {
  provider: ProviderInterface;
  claims: ClaimsInterface;
  scopes: ScopesInterface;
}
