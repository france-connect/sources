import classnames from 'classnames';
import React from 'react';
import type { FieldInputProps } from 'react-final-form';

export interface SearchBarComponentProps {
  size?: 'md' | 'lg';
  buttonLabel?: string;
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  canSubmit?: boolean;
  inputLabel?: string;
  className?: string;
  placeholder?: string;
}

export const SearchBarComponent: React.FC<SearchBarComponentProps> = React.memo(
  ({ buttonLabel, className, input, inputLabel, placeholder, size }: SearchBarComponentProps) => (
    <div
      className={classnames('fr-search-bar', className, {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-search-bar--lg': size === 'lg',
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

SearchBarComponent.defaultProps = {
  buttonLabel: undefined,
  canSubmit: true,
  className: undefined,
  inputLabel: undefined,
  placeholder: 'Rechercher',
  size: 'md',
};

SearchBarComponent.displayName = 'SearchBarComponent';
