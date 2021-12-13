import './search-form.scss';
import React, { FormEvent, useRef, useCallback } from 'react';
import classNames from 'classnames'
import { useMediaQuery } from 'react-responsive';
import { RiSearchLine as SearchIcon } from 'react-icons/ri';

type SearchFormComponentProps = {
  label: string;
  onChange: Function;
};

const SearchFormComponent = React.memo(
  ({ label, onChange }: SearchFormComponentProps): JSX.Element => {
    const inputField = useRef(null);
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    const onInputChangeHandler = useCallback(
      ({ target }) => {
        const { value } = target;
        onChange(value);
      },
      [onChange],
    );

    const onSubmitSearchForm = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { current: input } = inputField;

      if (input) {
        const { value } = input as HTMLInputElement;
        onChange(value);
      }

      return null;
    };

    return (
      <div>
        <h3 className={classNames("fs20 is-bold mx16", { "mb8": !gtTablet })}>
          Je recherche mon administration
        </h3>
        <form onSubmit={onSubmitSearchForm}>
          <label htmlFor="fi-search-term" className="mx16 mb16 fr-text is-g600">
            Veuillez taper le nom complet de votre administration
          </label>
          <p className="flex-columns px16 mb16 is-block search-form">
            <input
              ref={inputField}
              className="search-input px16 py8 flex-1"
              id="fi-search-term"
              name="fi-search-term"
              placeholder="ex&nbsp;:&nbsp;ministère de la mer, ministère de..."
              type="text"
              onChange={onInputChangeHandler}
            />
            <button type="submit" className={classNames("search-button is-white bg-blue-agentconnect fr-text-lg", { "pl32": gtTablet })}>
              <SearchIcon  role={"img"} />
              {gtTablet && <span className="pl12 pr32 py12">Rechercher</span>}
            </button>
          </p>
        </form>
      </div>
    );
  },
);

SearchFormComponent.displayName = 'SearchFormComponent';

export default SearchFormComponent;
