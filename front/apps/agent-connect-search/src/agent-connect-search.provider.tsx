import { ReactElement, useCallback, useEffect, useState } from 'react';

import { useApiGet } from '@fc/common';

import { AgentConnectSearchContext } from './agent-connect-search.context';
import { IdentityProvider, Ministry, PayloadState, SearchResult } from './interfaces';
import { AgentConnectSearchService } from './services';

type SearchApiResponse = {
  identityProviders: IdentityProvider[];
  ministries: Ministry[];
  redirectToIdentityProviderInputs: { csrfToken: string };
  serviceProviderName: string;
};

type AgentConnectSearchProviderProps = {
  children: ReactElement | ReactElement[];
  url: string;
  errorRoute: string;
};

export const AgentConnectSearchProvider = ({
  children,
  errorRoute,
  url,
}: AgentConnectSearchProviderProps): JSX.Element => {
  // @NOTE a supprimer avec l'implémentation du gestionnaire d'erreur REACT
  const data = useApiGet<SearchApiResponse>({ endpoint: url, errorPath: errorRoute });
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [payload, setPayload] = useState<PayloadState>({
    csrfToken: '',
    identityProviders: [],
    isLoaded: false,
    ministries: [],
    serviceProviderName: '',
  });

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      if (!payload.isLoaded) {
        return;
      }
      const term = (searchTerm && searchTerm.trim()) || '';

      let results = [];
      if (!term) {
        results = AgentConnectSearchService.showAllResults();
      } else {
        results = AgentConnectSearchService.search(term);
      }
      setHasSearched(true);
      setSearchResults(results);
    },
    [payload.isLoaded],
  );

  useEffect(() => {
    if (data && !payload.isLoaded) {
      const {
        identityProviders,
        ministries,
        redirectToIdentityProviderInputs: { csrfToken },
        serviceProviderName,
      } = data;
      AgentConnectSearchService.initialize(ministries, identityProviders);
      setPayload({
        csrfToken,
        identityProviders,
        isLoaded: true,
        ministries,
        serviceProviderName,
      });
    }
  }, [data, payload.isLoaded]);

  return (
    <AgentConnectSearchContext.Provider
      value={{ hasSearched, payload, searchResults, setSearchTerm }}>
      {children}
    </AgentConnectSearchContext.Provider>
  );
};

AgentConnectSearchProvider.displayName = 'AgentConnectSearchProvider';
