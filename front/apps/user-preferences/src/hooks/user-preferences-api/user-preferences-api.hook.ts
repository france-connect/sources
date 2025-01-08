import type { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HttpStatusCode } from '@fc/common';
import { ConfigService } from '@fc/config';
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

  const [submitErrors, setSubmitErrors] = useState<AxiosError | Error | undefined>(undefined);
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

  const fetchErrorHandler = useCallback(
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

  const fetchSuccessHandler = useCallback(
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
        .then(fetchSuccessHandler)
        .catch(fetchErrorHandler);
    },
    [fetchSuccessHandler, fetchErrorHandler, userPreferencesEndpoint],
  );

  const fetchUserPreferences = useCallback(async () => {
    // @TODO add try/catch
    // to throw an error if the api.get is rejected
    const response = await get<UserPreferencesDataInterface>(userPreferencesEndpoint);
    setUserPreferences(response.data);

    const values = UserPreferencesService.parseFormData(response.data);
    setFormValues(values);
  }, [userPreferencesEndpoint]);

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
