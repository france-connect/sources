import React, { PropsWithChildren } from 'react';

export const AxiosErrorCatcherContext = React.createContext(expect.any(Object));

export const AxiosErrorCatcherProvider = jest.fn(
  ({ children, value }: { value: any } & PropsWithChildren) => (
    <AxiosErrorCatcherContext.Provider value={value}>{children}</AxiosErrorCatcherContext.Provider>
  ),
);
