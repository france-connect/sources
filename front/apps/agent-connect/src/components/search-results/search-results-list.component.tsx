import './search-results-list.scss';

import React, { useContext } from 'react';

import { AgentConnectSearchContext, SearchResult } from '@fc/agent-connect-search';

import { SearchResultComponent } from './search-result.component';

type SearchResultsListComponentProps = {
  results: SearchResult[];
};

export const SearchResultsListComponent = React.memo(
  ({ results }: SearchResultsListComponentProps) => {
    const { payload } = useContext(AgentConnectSearchContext);
    const { csrfToken } = payload;
    return (
      <div className="v-align-middle text-left content-wrapper-md" id="identity-provider-result">
        <h4 className="is-bold is-blue-agentconnect px16 mb16 fr-text-lg">Résultats&nbsp;:</h4>
        {results.map(({ identityProviders, ministry }) => {
          const filteredIdps = identityProviders
            .filter((identityProvider) => identityProvider.display)
            .filter((identityProvider) => identityProvider.active);
          const hasIdentityProviders = filteredIdps.length > 0;
          return (
            <dl
              key={ministry.id}
              className="ministry-result mb32"
              data-testid={`ministry-${ministry.id}-search-list`}
              id={`ministry-${ministry.id}-search-list`}>
              <dt className="mx16 mb8 fr-text-lg is-bold">{ministry.name}</dt>
              <dd className="mx16 mb16 fr-text">
                {!hasIdentityProviders && (
                  <p>
                    Cette administration n’est pas encore reliée à AgentConnect pour cette
                    application
                  </p>
                )}
                <ul className="pl32">
                  {filteredIdps.map((identityProvider) => (
                    <li key={`${ministry.id}::${identityProvider.uid}`}>
                      <SearchResultComponent
                        csrfToken={csrfToken}
                        name={identityProvider.name}
                        uid={identityProvider.uid}
                      />
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          );
        })}
      </div>
    );
  },
);

SearchResultsListComponent.displayName = 'SearchResultsListComponent';
