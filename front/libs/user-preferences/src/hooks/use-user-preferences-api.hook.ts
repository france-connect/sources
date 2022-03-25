import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { useApiGet } from '@fc/common';

import {
  FormValues,
  IGetCsrfTokenResponse,
  UserPreferencesConfig,
  UserPreferencesData,
} from '../interfaces';
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
    const { allowFutureIdp, idpList } = UserPreferencesService.parseFormData(data);
    setFormValues({ allowFutureIdp: !allowFutureIdp, idpList });
    setSubmitErrors(undefined);
    setSubmitWithSuccess(true);
  }, []);

  const commit = useCallback(
    async ({ allowFutureIdp, idpList }) => {
      const {
        data: { csrfToken },
      } = await axios.get<IGetCsrfTokenResponse>(options.API_ROUTE_CSRF_TOKEN);

      const data = UserPreferencesService.encodeFormData({
        allowFutureIdp: !allowFutureIdp,
        csrfToken,
        idpList,
      });

      return axios
        .post(options.API_ROUTE_USER_PREFERENCES, data)
        .then(commitSuccessHandler)
        .catch(commitErrorHandler);
    },
    [
      commitSuccessHandler,
      commitErrorHandler,
      options.API_ROUTE_CSRF_TOKEN,
      options.API_ROUTE_USER_PREFERENCES,
    ],
  );

  useEffect(() => {
    if (userPreferences && !formValues) {
      // @NOTE
      // executed at first render only
      // when
      // if initial userPreferences has already been loaded
      // and if form values has not yet been set
      const { allowFutureIdp, idpList } = UserPreferencesService.parseFormData(userPreferences);
      setFormValues({ allowFutureIdp: !allowFutureIdp, idpList });
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
