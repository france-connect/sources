import React, { PropsWithChildren } from 'react';

export const AccountContext = React.createContext(expect.any(Object));

export const AccountProvider = jest.fn(
  ({ children, config }: { config: any } & PropsWithChildren) => (
    <AccountContext.Provider value={config}>
      <div data-mockid={'AccountProvider'}>
        <div>{children}</div>
      </div>
    </AccountContext.Provider>
  ),
);

export const ConnectValidator = {
  validate: jest.fn(),
};

export const Options = {
  CONFIG_NAME: 'Account',
};
