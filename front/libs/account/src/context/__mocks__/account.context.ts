import React, { ProviderExoticComponent, ProviderProps } from 'react';

export const AccountContext = React.createContext(expect.any(Object));

AccountContext.Provider = jest
  .fn()
  .mockImplementation(({ children }) => children) as unknown as ProviderExoticComponent<
  ProviderProps<any>
>;
