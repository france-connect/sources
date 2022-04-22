import React from 'react';

export const useUserinfos = jest.fn(() => null);

export const UserInfosProvider = jest.fn();

export const UserInfosContext = React.createContext(expect.any(Object));

export const RedirectToIdpFormComponent = jest.fn(({ children }) => (
  <React.Fragment>
    <div>FoorBar RedirectToIdpFormComponentMock</div>
    {children}
  </React.Fragment>
));
