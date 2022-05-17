import classNames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { SearchFormComponent } from '../search-form';
import { SearchResultsComponent } from '../search-results';

export const SearchComponent = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

  return (
    <div
      // Class CSS
      // eslint-disable-next-line @typescript-eslint/naming-convention
      className={classNames('content-wrapper-md', { 'text-center': gtTablet })}
      data-testid="wrapper">
      <SearchFormComponent />
      <SearchResultsComponent />
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';
