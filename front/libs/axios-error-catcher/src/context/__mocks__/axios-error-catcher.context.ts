import React, { ProviderExoticComponent, ProviderProps } from 'react';

export const AxiosErrorCatcherContext = React.createContext(expect.any(Object));

AxiosErrorCatcherContext.Provider = jest
  .fn()
  .mockImplementation(({ children }) => children) as unknown as ProviderExoticComponent<
  ProviderProps<any>
>;
