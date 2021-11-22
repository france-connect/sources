import './search-form.scss';
import React, { FormEvent, useCallback } from 'react';
import { RiSearchLine as SearchIcon } from 'react-icons/ri';

type SearchFormComponentProps = {
  label: string;
  onChange: Function;
};

const SearchFormComponent = React.memo(
  ({ label, onChange }: SearchFormComponentProps): JSX.Element => {
    const onInputChangeHandler = useCallback(
      ({ target }) => {
        const { value } = target;
        onChange(value);
      },
      [onChange],
    );

    const onSubmitSearchForm = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const input = document.getElementById('fi-search-term') as any;
      if (input) {
        const { value } = input.value;
        onChange(value);
      }
    };
    return (
      <div className="text-center">
        <h4 className="my16 is-bold mt20 mx120 mb4">
          Je recherche mon administration
        </h4>
        <form onSubmit={onSubmitSearchForm}>
          <label htmlFor="fi-search-term" className="my4 mb8">
            <span>Veuillez taper le nom complet de votre administration</span>
          </label>
          <p className="is-block search-form">
            <input
              className="search-input"
              id="fi-search-term"
              name="fi-search-term"
              placeholder="ex: ministère de la mer, ministère de..."
              type="text"
              onChange={onInputChangeHandler}
            />
            <button type="submit" className="search-button">
              <SearchIcon />
              <b>Rechercher</b>
            </button>
          </p>
        </form>
      </div>
    );
  },
);

SearchFormComponent.displayName = 'SearchFormComponent';

export default SearchFormComponent;
