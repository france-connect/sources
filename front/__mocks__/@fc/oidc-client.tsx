import React, { PropsWithChildren } from 'react';

export const RedirectToIdpFormComponent = jest.fn(({ children }: PropsWithChildren) => (
  <React.Fragment>
    <div>FoorBar RedirectToIdpFormComponentMock</div>
    {children}
  </React.Fragment>
));
