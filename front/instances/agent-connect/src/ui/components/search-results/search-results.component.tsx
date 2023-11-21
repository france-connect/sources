import React, { useContext } from 'react';

import {
  AgentConnectSearchContext,
  IdentityProvider,
  useSearchResults,
} from '@fc/agent-connect-search';

import { MONCOMPTEPRO_UID } from '../../../config';
import { NoResultComponent } from './no-result.component';
import { SearchResultsListComponent } from './search-results-list.component';

export const SearchResultsComponent = React.memo(() => {
  const { searchResults, showNoResults, showResults } = useSearchResults();
  const { payload } = useContext(AgentConnectSearchContext);

  /* istanbul ignore next */
  const isMoncompteProAvailable = (identityProviders: IdentityProvider[]): boolean => {
    const moncomptepro = identityProviders.find((idp) => idp.uid === MONCOMPTEPRO_UID);
    return !!moncomptepro && moncomptepro.active && moncomptepro.display;
  };

  /* istanbul ignore next */
  return (
    <React.Fragment>
      {showResults && <SearchResultsListComponent results={searchResults} />}
      {showNoResults && (
        <NoResultComponent
          isMoncompteProAvailable={isMoncompteProAvailable(payload.identityProviders)}
        />
      )}
    </React.Fragment>
  );
});

SearchResultsComponent.displayName = 'SearchResultsComponent';
