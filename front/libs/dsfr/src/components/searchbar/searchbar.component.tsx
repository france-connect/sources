import classnames from 'classnames';
import React from 'react';
import type { FieldInputProps } from 'react-final-form';

import { Sizes } from '../../enums';

interface SearchBarComponentProps {
  size?: Omit<Sizes, Sizes.SMALL>;
  buttonLabel?: string;
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  inputLabel?: string;
  className?: string;
  placeholder?: string;
}

export const SearchBarComponent = React.memo(
  ({
    buttonLabel,
    className,
    input,
    inputLabel,
    // @TODO use default i18n value for placeholder = 'Rechercher',
    placeholder = 'Rechercher',
    size = Sizes.MEDIUM,
  }: SearchBarComponentProps) => (
    <div
      className={classnames('fr-search-bar', className, {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-search-bar--lg': size === Sizes.LARGE,
      })}
      id={`searchbar-${input.name}`}
      role="search">
      <label className="fr-label" htmlFor={input.name}>
        {inputLabel}
      </label>
      <input
        id={input.name}
        {...input}
        className="fr-input"
        name={input.name}
        placeholder={placeholder}
        type="search"
      />
      <button className="fr-btn">{buttonLabel}</button>
    </div>
  ),
);

SearchBarComponent.displayName = 'SearchBarComponent';
