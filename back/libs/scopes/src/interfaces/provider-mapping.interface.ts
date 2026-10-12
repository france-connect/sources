import { ClaimsInterface } from './claims.interface';
import { DatapassScopeMappingInterface } from './datapass-scope-mapping.interface';
import { ScopesInterface } from './scopes.interface';

export interface ProviderInterface {
  slug: string;
  label: string;
}

export interface ProviderMappingsInterface {
  provider: ProviderInterface;
  claims: ClaimsInterface;
  scopes: ScopesInterface;
  datapassScopeMapping?: DatapassScopeMappingInterface;
}
