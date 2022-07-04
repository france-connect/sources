import './user-preferences.scss';

import React from 'react';
import { Form } from 'react-final-form';

import { useUserPreferencesApi } from '../hooks';
import { UserPreferencesConfig } from '../interfaces';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

interface UserPreferencesComponentProps {
  options: UserPreferencesConfig;
}

export const UserPreferencesComponent: React.FC<UserPreferencesComponentProps> = React.memo(
  ({ options }: UserPreferencesComponentProps) => {
    const { commit, formValues, submitWithSuccess, userPreferences, validateHandler } =
      useUserPreferencesApi(options);
    return (
      <Form
        initialValues={formValues}
        validate={
          // @TODO test form
          /* istanbul ignore next */
          (values) => validateHandler(values)
        }
        onSubmit={commit}>
        {({
          dirty,
          errors,
          handleSubmit,
          hasValidationErrors,
          pristine: isSameAsInitialValues,
          submitting,
        }) => {
          const isDisabled = !!(isSameAsInitialValues || submitting || hasValidationErrors);
          const showNotification = !dirty && submitWithSuccess;
          return (
            <UserPreferencesFormComponent
              errors={errors}
              hasValidationErrors={hasValidationErrors}
              isDisabled={isDisabled}
              showNotification={showNotification}
              userPreferences={userPreferences}
              onSubmit={handleSubmit}
            />
          );
        }}
      </Form>
    );
  },
);

UserPreferencesComponent.displayName = 'UserPreferencesComponent';
