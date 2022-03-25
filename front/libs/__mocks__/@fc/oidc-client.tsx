import React from 'react';

export const useUserinfos = jest.fn(() => null);

export const RedirectToIdpFormComponent = jest.fn(({ children }) => (
  <React.Fragment>
    <div>FoorBar RedirectToIdpFormComponentMock</div>
    {children}
  </React.Fragment>
));
