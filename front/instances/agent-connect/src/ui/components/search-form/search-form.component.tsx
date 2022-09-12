import classnames from 'classnames';
import React from 'react';
import { Field, Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';

import { useOnSearch } from '@fc/agent-connect-search';
import { SearchBarComponent } from '@fc/dsfr';

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
      <React.Fragment>
        <h3
          className={classnames('fr-text--xl fr-text--bold fr-mx-2w', {
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-1v': gtTablet,
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-1w': !gtTablet,
          })}
          data-testid="form-title">
          Je recherche mon administration
        </h3>
        <Form initialValues={formData} onSubmit={onSearch}>
          {({ handleSubmit }) => (
            <form data-testid="search-form" onSubmit={handleSubmit}>
              <label
                className="fr-mx-2w is-block"
                data-testid="input-label"
                htmlFor="fi-search-term">
                Veuillez taper le nom complet de votre administration
              </label>
              <Field name="fi-search-term">
                {({ input }) => (
                  <SearchBarComponent
                    buttonLabel="Rechercher"
                    className="fr-px-2w fr-py-1w fr-mb-2w"
                    input={input}
                    placeholder="ex : ministère de la mer, ministère de..."
                    size="lg"
                  />
                )}
              </Field>
              <OnChange name="fi-search-term">{onSearch}</OnChange>
            </form>
          )}
        </Form>
      </React.Fragment>
    );
  },
);

SearchFormComponent.defaultProps = {
  // label HTML name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  formData: { 'fi-search-term': undefined },
};

SearchFormComponent.displayName = 'SearchFormComponent';
