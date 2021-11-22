import React, { useContext } from 'react';

import { AppContext, AppContextInterface } from '@fc/state-management';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';
import { useApiGet } from '@fc/common';

import { ButtonLoginComponent } from '../button-login';
import { ButtonLogoutComponent } from '../button-logout';

interface csrfResponse {
  csrfToken: string;
}

export const UserWidgetComponent = () => {
  const csrf = useApiGet<csrfResponse>({ endpoint: '/api/csrf' });
  const { state } = useContext<AppContextInterface>(AppContext);

  if (state.user.connected) {
    return <ButtonLogoutComponent />;
  }

  return (
    <React.Fragment>
      {csrf && (
        <RedirectToIdpFormComponent id="login-form" csrf={csrf.csrfToken}>
          <ButtonLoginComponent />
        </RedirectToIdpFormComponent>
      )}
    </React.Fragment>
  );
};
