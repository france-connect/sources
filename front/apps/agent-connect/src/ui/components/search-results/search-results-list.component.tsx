import classnames from 'classnames';
import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import { AgentConnectSearchContext, SearchResult } from '@fc/agent-connect-search';

import { SearchResultComponent } from './search-result.component';
import styles from './search-results-list.module.scss';

type SearchResultsListComponentProps = {
  results: SearchResult[];
};

export const SearchResultsListComponent = React.memo(
  ({ results }: SearchResultsListComponentProps) => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
    const { payload } = useContext(AgentConnectSearchContext);
    const { csrfToken } = payload;
    return (
      <div className="v-align-middle text-left content-wrapper-md" id="identity-provider-result">
        <h4 className={classnames(styles.pretitle, 'fr-text--bold fr-px-2w fr-mb-2w fr-text--lg')}>
          Résultats&nbsp;:
        </h4>
        {results.map(({ identityProviders, ministry }) => {
          const filteredIdps = identityProviders
            .filter((identityProvider) => identityProvider.display)
            .filter((identityProvider) => identityProvider.active);
          const hasIdentityProviders = filteredIdps.length > 0;
          return (
            <dl
              key={ministry.id}
              className={classnames(styles.results, 'fr-mb-2w')}
              data-testid={`ministry-search-list__${ministry.id}`}>
              <dt className="fr-mx-2w fr-mb-1w fr-text--lg fr-text--bold">{ministry.name}</dt>
              <dd className="fr-mx-2w fr-mb-2w fr-text--md">
                {!hasIdentityProviders && (
                  <p className="fr-mb-0">
                    Cette administration n’est pas encore reliée à AgentConnect pour cette
                    application
                  </p>
                )}
                <ul
                  className={classnames({
                    // Class CSS
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'fr-pl-2w': !gtTablet,
                    // Class CSS
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'fr-pl-4w': gtTablet,
                  })}>
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
