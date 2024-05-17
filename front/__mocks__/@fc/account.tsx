import React, { PropsWithChildren } from 'react';

export const AccountContext = React.createContext(expect.any(Object));

export const AccountProvider = jest.fn(
  ({ children, config }: { config: any } & PropsWithChildren) => (
    <AccountContext.Provider value={config}>
      <div data-mockid={'AccountProvider'}>
        <div>AccountProvider</div>
        <div>{children}</div>
      </div>
    </AccountContext.Provider>
  ),
);
