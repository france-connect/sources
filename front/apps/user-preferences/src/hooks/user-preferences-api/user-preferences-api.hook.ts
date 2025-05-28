import type { AxiosResponse } from 'axios';
import { HttpStatusCode } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { ConfigService } from '@fc/config';
import type { AxiosException } from '@fc/http-client';
import { get, post } from '@fc/http-client';

import { Options } from '../../enums';
import type {
  FormValuesInterface,
  UserPreferencesConfig,
  UserPreferencesDataInterface,
} from '../../interfaces';
import type { UserPreferencesServiceInterface } from '../../services';
import { UserPreferencesService } from '../../services';

export const useUserPreferencesApi = () => {
  const navigate = useNavigate();

  const {
    endpoints: { userPreferences: userPreferencesEndpoint },
  } = ConfigService.get<UserPreferencesConfig>(Options.CONFIG_NAME);

  const [submitErrors, setSubmitErrors] = useState<AxiosException | Error | undefined>(undefined);
  const [submitWithSuccess, setSubmitWithSuccess] = useState(false);
  const [formValues, setFormValues] = useState<FormValuesInterface | undefined>(undefined);
  const [userPreferences, setUserPreferences] = useState<UserPreferencesDataInterface | undefined>(
    undefined,
  );

  const validateHandler = useCallback(({ idpList }: Pick<FormValuesInterface, 'idpList'>) => {
    const isDefinedPreferences = idpList && Object.values(idpList);
    const hasError = isDefinedPreferences && !isDefinedPreferences.includes(true);
    if (!hasError) {
      return undefined;
    }
    return {
      idpList: 'error',
    };
  }, []);

  const commitErrorHandler = useCallback(
    (err: unknown) => {
      const error = err as AxiosException;
      const isConflictError = error?.status === HttpStatusCode.Conflict;
      if (isConflictError) {
        navigate('/error/409', { replace: true });
      } else {
        setSubmitErrors(error);
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
      const axiosOptions = { formSerializer: { indexes: null } };
      const data = UserPreferencesService.encodeFormData({ allowFutureIdp, idpList });

      return post<UserPreferencesDataInterface>(userPreferencesEndpoint, data, axiosOptions)
        .then(commitSuccessHandler)
        .catch(commitErrorHandler);
    },
    [commitSuccessHandler, commitErrorHandler, userPreferencesEndpoint],
  );

  const fetchErrorHandler = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  const fetchSuccessHandler = useCallback(
    (response: AxiosResponse<UserPreferencesDataInterface>) => {
      setUserPreferences(response.data);
      const values = UserPreferencesService.parseFormData(response.data);
      setFormValues(values);
    },
    [],
  );

  const fetchUserPreferences = useCallback(async () => {
    get<UserPreferencesDataInterface>(userPreferencesEndpoint)
      .then(fetchSuccessHandler)
      .catch(fetchErrorHandler);
  }, [fetchSuccessHandler, fetchErrorHandler, userPreferencesEndpoint]);

  useEffect(() => {
    fetchUserPreferences();
    // @NOTE This hook should only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    commit,
    formValues,
    submitErrors,
    submitWithSuccess,
    userPreferences,
    validateHandler,
  };
};
