/* istanbul ignore file */

// @TODO refacto, use useUserInfo hook
import { useContext } from 'react';

import { useApiGet } from '@fc/common';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';
import { AppContext, AppContextInterface } from '@fc/state-management';

import { ButtonLoginComponent } from '../button-login';
import { ButtonLogoutComponent } from '../button-logout';

interface CsrfResponse {
  csrfToken: string;
}

export const UserWidgetComponent = () => {
  const csrf = useApiGet<CsrfResponse>({ endpoint: '/api/csrf' });
  const { state } = useContext<AppContextInterface>(AppContext);

  if (state.user.connected) {
    return <ButtonLogoutComponent />;
  }

  return (
    (csrf && (
      <RedirectToIdpFormComponent csrf={csrf.csrfToken} id="login-form">
        <ButtonLoginComponent />
      </RedirectToIdpFormComponent>
    )) ||
    null
  );
};
