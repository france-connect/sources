import './user-preferences.scss';

import React from 'react';
import { Form } from 'react-final-form';

import { useUserPreferencesApi } from '../hooks';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

export const UserPreferencesComponent = React.memo(() => {
  const { commit, formValues, submitWithSuccess, userPreferences, validateHandler } =
    useUserPreferencesApi();
  const showServicesList = !!userPreferences?.idpList?.length;

  if (!showServicesList) {
    return null;
  }

  return (
    <Form
      initialValues={formValues}
      validate={
        // @TODO test form
        /* istanbul ignore next */
        (values) => validateHandler(values)
      }
      onSubmit={commit}>
      {({ handleSubmit }) => (
        <form
          data-testid="user-preferences-form"
          id="user-preferences-form-component"
          onSubmit={handleSubmit}>
          <UserPreferencesFormComponent
            submitWithSuccess={submitWithSuccess}
            userPreferences={userPreferences}
          />
        </form>
      )}
    </Form>
  );
});

UserPreferencesComponent.displayName = 'UserPreferencesComponent';
