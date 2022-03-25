import './search-form.scss';

import classnames from 'classnames';
import React from 'react';
import { RiSearchLine as SearchIcon } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

type SearchSubmitButtonComponentProps = {
  disabled: boolean;
};

export const SearchSubmitButtonComponent = React.memo(
  ({ disabled }: SearchSubmitButtonComponentProps) => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    return (
      <button
        className={classnames('search-button is-white bg-blue-agentconnect fr-text-lg', {
          pl32: gtTablet,
        })}
        data-testid="button"
        disabled={disabled}
        type="submit">
        <SearchIcon role="img" />
        <span className={classnames('pl12 pr32 py12', { hide: !gtTablet })} data-testid="label">
          Rechercher
        </span>
      </button>
    );
  },
);

SearchSubmitButtonComponent.displayName = 'SearchSubmitButtonComponent';
