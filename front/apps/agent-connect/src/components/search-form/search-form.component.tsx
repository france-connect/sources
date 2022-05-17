import './search-form.scss';

import classnames from 'classnames';
import React from 'react';
import { Field, Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';

import { useOnSearch } from '@fc/agent-connect-search';

import { SearchSubmitButtonComponent } from './search-submit-button.component';

type SearchFormComponentProps = {
  formData?: {
    // label HTML name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'fi-search-term': string | undefined;
  };
};

export const SearchFormComponent: React.FC<SearchFormComponentProps> = React.memo(
  ({ formData }: SearchFormComponentProps) => {
    const onSearch = useOnSearch();
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    return (
      <div>
        <h3
          className={classnames('fs20 is-bold mx16', { mb8: !gtTablet })}
          data-testid="form-title">
          Je recherche mon administration
        </h3>
        <Form
          initialValues={formData}
          render={({ handleSubmit, pristine, submitting }) => (
            <form data-testid="search-form" onSubmit={handleSubmit}>
              <label
                className="mx16 mb16 fr-text is-g600"
                data-testid="input-label"
                htmlFor="fi-search-term">
                Veuillez taper le nom complet de votre administration
              </label>
              <div className="flex-columns px16 mb16 is-block search-form">
                <Field
                  className="search-input px16 py8 flex-1"
                  component="input"
                  data-testid="search-input"
                  id="fi-search-term"
                  name="fi-search-term"
                  placeholder="ex : ministère de la mer, ministère de..."
                  type="text"
                />
                <OnChange name="fi-search-term">{onSearch}</OnChange>
                <SearchSubmitButtonComponent disabled={submitting || pristine} />
              </div>
            </form>
          )}
          onSubmit={(values) => {
            onSearch(values['fi-search-term']);
          }}
        />
      </div>
    );
  },
);

SearchFormComponent.defaultProps = {
  // label HTML name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  formData: { 'fi-search-term': undefined },
};

SearchFormComponent.displayName = 'SearchFormComponent';
