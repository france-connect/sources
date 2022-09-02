import axios, { AxiosError } from 'axios';
import { ReactElement, useContext, useEffect, useState } from 'react';

import { AccountContext } from '@fc/account';
import { HttpStatusCode } from '@fc/common';

import { AxiosErrorCatcher } from '../inferfaces';
import { AxiosErrorCatcherContext } from './axios-error-catcher.context';

export interface AxiosErrorCatcherProviderProps {
  children: ReactElement | ReactElement[];
}

export const AxiosErrorCatcherProvider = ({ children }: AxiosErrorCatcherProviderProps) => {
  const { connected } = useContext(AccountContext);
  const [state, setState] = useState<AxiosErrorCatcher>({
    codeError: undefined,
    hasError: false,
  });

  useEffect(() => {
    const errorCatcherInterceptor = axios.interceptors.response.use(
      undefined,
      (error: AxiosError) => {
        if (error.response?.status === HttpStatusCode.UNAUTHORIZED && connected) {
          setState({ codeError: HttpStatusCode.UNAUTHORIZED, hasError: true });
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(errorCatcherInterceptor);
    };
  }, [connected]);

  return (
    <AxiosErrorCatcherContext.Provider value={{ ...state }}>
      {children}
    </AxiosErrorCatcherContext.Provider>
  );
};
