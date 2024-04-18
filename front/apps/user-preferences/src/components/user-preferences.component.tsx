import './user-preferences.scss';

import React from 'react';
import { Form } from 'react-final-form';

import { useUserPreferencesApi } from '../hooks';
import type { UserPreferencesConfig } from '../interfaces';
import { UserPreferencesFormComponent } from './user-preferences-form.component';

interface UserPreferencesComponentProps {
  options: UserPreferencesConfig;
}

export const UserPreferencesComponent: React.FC<UserPreferencesComponentProps> = React.memo(
  ({ options }: UserPreferencesComponentProps) => {
    const { commit, formValues, submitWithSuccess, userPreferences, validateHandler } =
      useUserPreferencesApi(options);
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
        {({
          dirty,
          dirtyFields,
          handleSubmit,
          hasValidationErrors,
          pristine: isSameAsInitialValues,
          submitting,
        }) => {
          const isDisabled = isSameAsInitialValues || submitting || hasValidationErrors;
          const showNotification = !dirty && submitWithSuccess;
          return (
            <UserPreferencesFormComponent
              // @TODO instead of passing through all props use the hook
              // useFormState (https://final-form.org/docs/react-final-form/api/useFormState)
              // to replace dirtyFields/hasValidationErrors/onSubmit/isDisabled/showNotification
              dirtyFields={dirtyFields}
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
