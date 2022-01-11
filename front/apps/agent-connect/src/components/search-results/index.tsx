import './results-list.scss';

import React from 'react';

import { isSearchTermValid } from '../../core/search';
import { Ministry } from '../../types';
import { SearchResultsComponent as ResultsListComponent } from './results-list';

type SearchResultsProps = {
  term: string | undefined;
  results: Ministry[];
};

export const SearchResultsComponent = ({ results, term }: SearchResultsProps): JSX.Element => {
  const hasResults = results.length > 0;
  const showNoSearchResults = isSearchTermValid(term) && !hasResults;

  return (
    <React.Fragment>
      {hasResults && <ResultsListComponent results={results} />}
      {showNoSearchResults && (
        <div className="mx16 fr-text-lg">Aucun fournisseur d&apos;identité n&apos;a été trouvé</div>
      )}
    </React.Fragment>
  );
};

SearchResultsComponent.displayName = 'SearchResultsComponent';
