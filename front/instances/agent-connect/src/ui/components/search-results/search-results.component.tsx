import React from 'react';

import { useSearchResults } from '@fc/agent-connect-search';

import { SearchResultsListComponent } from './search-results-list.component';

export const SearchResultsComponent = React.memo(() => {
  const { searchResults, showNoResults, showResults } = useSearchResults();
  return (
    <React.Fragment>
      {showResults && <SearchResultsListComponent results={searchResults} />}
      {showNoResults && (
        <div className="fr-mx-2w fr-text--lg" id="identity-provider-result">
          Aucun fournisseur d&rsquo;identité n&rsquo;a été trouvé
        </div>
      )}
    </React.Fragment>
  );
});

SearchResultsComponent.displayName = 'SearchResultsComponent';
