import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HttpStatusCode, useApiGet } from '@fc/common';
import type { GetCsrfTokenResponseInterface } from '@fc/http-client';

import type {
  FormValuesInterface,
  UserPreferencesConfig,
  UserPreferencesDataInterface,
} from '../interfaces';
import type { UserPreferencesServiceInterface } from '../services';
import { UserPreferencesService } from '../services';

export const validateHandlerCallback = ({ idpList }: Pick<FormValuesInterface, 'idpList'>) => {
  const isDefinedPreferences = idpList && Object.values(idpList);
  const hasError = isDefinedPreferences && !isDefinedPreferences.includes(true);

  if (!hasError) {
    return undefined;
  }

  return {
    idpList: 'error',
  };
};

export const useUserPreferencesApi = (options: UserPreferencesConfig) => {
  const navigate = useNavigate();

  const userPreferences: UserPreferencesDataInterface = useApiGet({
    endpoint: options.API_ROUTE_USER_PREFERENCES,
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosError | Error | undefined>(undefined);
  const [submitWithSuccess, setSubmitWithSuccess] = useState(false);
  const [formValues, setFormValues] = useState<FormValuesInterface | undefined>(undefined);

  const validateHandler = useCallback(validateHandlerCallback, []);

  const commitErrorHandler = useCallback(
    (err: unknown) => {
      const { response } = err as AxiosError;
      if (response?.status === HttpStatusCode.CONFLICT) {
        navigate('/error/409', { replace: true });
      } else {
        setSubmitErrors(err as AxiosError | Error);
        setSubmitWithSuccess(false);
      }
    },
    [navigate],
  );

  const commitSuccessHandler = useCallback(
    ({ data }: AxiosResponse<UserPreferencesDataInterface>) => {
      const { allowFutureIdp, idpList } = UserPreferencesService.parseFormData(data);
      setFormValues({ allowFutureIdp, idpList });
      setSubmitErrors(undefined);
      setSubmitWithSuccess(true);
    },
    [],
  );

  const commit = useCallback(
    async ({
      allowFutureIdp,
      idpList,
    }: Pick<UserPreferencesServiceInterface, 'allowFutureIdp' | 'idpList'>) => {
      const {
        data: { csrfToken },
      } = await axios.get<GetCsrfTokenResponseInterface>(options.API_ROUTE_CSRF_TOKEN);

      const data = UserPreferencesService.encodeFormData({
        allowFutureIdp,
        csrfToken,
        idpList,
      });

      return axios
        .post<UserPreferencesDataInterface>(options.API_ROUTE_USER_PREFERENCES, data)
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
      setFormValues({ allowFutureIdp, idpList });
    }
  }, [userPreferences, formValues]);

  return {
    commit,
    formValues,
    submitErrors,
    submitWithSuccess,
    userPreferences,
    validateHandler,
  };
};
