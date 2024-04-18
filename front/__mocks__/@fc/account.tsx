import React from 'react';

export const AccountProvider = jest.fn(({ children }) => (
  <div data-mockid={'AccountProvider'}>
    <div>AccountProvider</div>
    <div>{children}</div>
  </div>
));

export const AccountContext = React.createContext(expect.any(Object));
