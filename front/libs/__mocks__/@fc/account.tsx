import React from 'react';

export const AccountProvider = jest.fn(({ children }) => (
  <div>
    <div>AccountProvider</div>
    <div>{children}</div>
  </div>
));

export const AccountContext = React.createContext(expect.any(Object));
