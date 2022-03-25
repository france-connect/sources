/* istanbul ignore file */

// declarative file
import { Dispatch, SetStateAction } from 'react';

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
  setSearchTerm: Dispatch<SetStateAction<string>>;
  hasSearched: boolean;
  searchResults: SearchResult[];
}
