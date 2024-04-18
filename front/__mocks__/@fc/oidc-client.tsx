import React from 'react';

export const RedirectToIdpFormComponent = jest.fn(({ children }) => (
  <React.Fragment>
    <div>FoorBar RedirectToIdpFormComponentMock</div>
    {children}
  </React.Fragment>
));
