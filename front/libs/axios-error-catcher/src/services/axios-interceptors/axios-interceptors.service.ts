import type { AxiosError } from 'axios';
import axios from 'axios';
import type { Dispatch, SetStateAction } from 'react';

import type { AxiosErrorCatcherInterface } from '../../inferfaces';

export const addAxiosCatcherInterceptors = (
  updateState: Dispatch<SetStateAction<AxiosErrorCatcherInterface>>,
) => {
  const requestInterceptor = axios.interceptors.request.use((config) => {
    updateState((prev) => ({ ...prev, codeError: undefined, hasError: false }));
    return config;
  }, undefined);

  const errorInterceptor = axios.interceptors.response.use(undefined, (error: AxiosError) => {
    updateState((prev) => ({ ...prev, codeError: error.response?.status, hasError: true }));
    return Promise.reject(error);
  });

  return [requestInterceptor, errorInterceptor];
};

export const removeAxiosCatcherInterceptors = ([
  requestInterceptor,
  errorInterceptor,
]: number[]) => {
  axios.interceptors.request.eject(requestInterceptor);
  axios.interceptors.response.eject(errorInterceptor);
};
