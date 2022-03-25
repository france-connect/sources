/* istanbul ignore file */

// declarative file
import { IdentityProvider } from './identity-provider.interface';
import { Ministry } from './ministry.interface';

export interface SearchResult {
  ministry: Ministry;
  identityProviders: IdentityProvider[];
}
