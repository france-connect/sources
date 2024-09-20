import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import type { AxiosErrorCatcherInterface } from '../inferfaces';
import { addAxiosCatcherInterceptors, removeAxiosCatcherInterceptors } from '../services';
import { AxiosErrorCatcherContext } from './axios-error-catcher.context';

export const AxiosErrorCatcherProvider = ({ children }: Required<PropsWithChildren>) => {
  const [state, setState] = useState<AxiosErrorCatcherInterface>({
    codeError: undefined,
    hasError: false,
    initialized: false,
  });

  useEffect(() => {
    const interceptors = addAxiosCatcherInterceptors(setState);

    // @NOTE
    // flag all interceptors as initialized
    setState((prev) => ({ ...prev, initialized: true }));

    return () => {
      removeAxiosCatcherInterceptors(interceptors);
    };
  }, []);

  if (!state.initialized) {
    return null;
  }

  return (
    <AxiosErrorCatcherContext.Provider value={state}>{children}</AxiosErrorCatcherContext.Provider>
  );
};
