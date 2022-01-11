/**
 * @TODO Coverage < 100% -> dette
 * Can not mock FUSE library
 */
import classNames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { SearchFormComponent } from '../../components/search-form';
import { SearchResultsComponent } from '../../components/search-results';
import { useSearch } from '../../hooks/use-search.hook';

export const SearchComponent = React.memo((): JSX.Element => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

  const { onFormChange, results, searchTerm } = useSearch();

  return (
    <div
      className={classNames('row mb-8 content-wrapper-md', { 'text-center': gtTablet })}
      id="identity-provider-search">
      <SearchFormComponent onChange={onFormChange} />
      <SearchResultsComponent results={results} term={searchTerm} />
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';
