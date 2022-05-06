import './styles.scss';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { UserInfosProvider } from '@fc/oidc-client';
import { AppContextProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { routes } from '../config/routes';

export function Application(): JSX.Element {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppContextProvider value={{ config: AppConfig }}>
          <UserInfosProvider userInfosEndpoint={AppConfig.OidcClient.endpoints.getUserInfos}>
            <DsfrLayout config={AppConfig.Layout} routes={routes} />
          </UserInfosProvider>
        </AppContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
