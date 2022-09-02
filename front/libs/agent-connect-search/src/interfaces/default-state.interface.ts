/* istanbul ignore file */

// declarative file
import { IdentityProvider } from './identity-provider.interface';
import { Ministry } from './ministry.interface';
import { SearchResult } from './search-result.interface';

export interface DefaultState {
  payload: {
    csrfToken: string;
    identityProviders: IdentityProvider[];
    isLoaded: boolean;
    ministries: Ministry[];
    serviceProviderName: string | undefined;
  };
  setSearchTerm: (value: string) => void;
  hasSearched: boolean;
  searchResults: SearchResult[];
}
