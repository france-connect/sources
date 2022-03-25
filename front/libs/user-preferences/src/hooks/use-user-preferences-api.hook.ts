import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { useApiGet } from '@fc/common';

import { FormValues, UserPreferencesConfig, UserPreferencesData } from '../interfaces';
import { UserPreferencesService } from '../services';

export const useUserPreferencesApi = (options: UserPreferencesConfig) => {
  const userPreferences: UserPreferencesData = useApiGet({
    endpoint: options.API_ROUTE_USER_PREFERENCES,
  });

  const [submitErrors, setSubmitErrors] = useState(undefined);
  const [submitWithSuccess, setSubmitWithSuccess] = useState(false);
  const [formValues, setFormValues] = useState<FormValues | undefined>(undefined);

  const commitErrorHandler = useCallback((err) => {
    setSubmitErrors(err);
    setSubmitWithSuccess(false);
  }, []);

  const commitSuccessHandler = useCallback(({ data }) => {
    const values = UserPreferencesService.parseFormData(data);
    setFormValues(values);
    setSubmitErrors(undefined);
    setSubmitWithSuccess(true);
  }, []);

  const commit = useCallback(
    ({ allowFutureIdp, idpList }) => {
      const data = UserPreferencesService.encodeFormData({
        allowFutureIdp,
        idpList,
      });
      return axios
        .post(options.API_ROUTE_USER_PREFERENCES, data)
        .then(commitSuccessHandler)
        .catch(commitErrorHandler);
    },
    [commitSuccessHandler, commitErrorHandler, options.API_ROUTE_USER_PREFERENCES],
  );

  useEffect(() => {
    if (userPreferences && !formValues) {
      // @NOTE
      // executed at first render only
      // when
      // if initial userPreferences has already been loaded
      // and if form values has not yet been set
      const values = UserPreferencesService.parseFormData(userPreferences);
      setFormValues(values);
    }
  }, [userPreferences, formValues]);

  return {
    commit,
    formValues,
    submitErrors,
    submitWithSuccess,
    userPreferences,
  };
};
