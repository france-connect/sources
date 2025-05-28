import type { PropsWithChildren } from 'react';
import React from 'react';

export const AxiosErrorCatcherContext = React.createContext(expect.any(Object));

export const AxiosErrorCatcherProvider = jest.fn(
  ({ children, value }: { value: unknown } & PropsWithChildren) => (
    <AxiosErrorCatcherContext.Provider value={value}>{children}</AxiosErrorCatcherContext.Provider>
  ),
);
