import type { ProviderExoticComponent, ProviderProps } from 'react';
import React from 'react';

export const AxiosErrorCatcherContext = React.createContext(expect.any(Object));

AxiosErrorCatcherContext.Provider = jest
  .fn()
  .mockImplementation(({ children }) => children) as unknown as ProviderExoticComponent<
  ProviderProps<unknown>
>;
