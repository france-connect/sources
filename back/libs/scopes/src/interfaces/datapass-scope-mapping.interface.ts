import { ScopeInterface } from './scopes.interface';

export interface DatapassScopeMappingInterface {
  readonly [key: ScopeInterface]: readonly ScopeInterface[];
}
