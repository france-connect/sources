import React, { PropsWithChildren } from 'react';

export const RedirectToIdpFormComponent = jest.fn(({ children }: PropsWithChildren) => (
  <React.Fragment>
    <div>FoorBar RedirectToIdpFormComponentMock</div>
    {children}
  </React.Fragment>
));

export const Options = {
  CONFIG_NAME: 'OidcClient',
};
