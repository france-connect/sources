import React, { PropsWithChildren } from 'react';

export const AppContext = React.createContext(expect.any(Object));

export const AppContextProvider = jest.fn(
  ({ children, value }: { value: any } & PropsWithChildren) => (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  ),
);
