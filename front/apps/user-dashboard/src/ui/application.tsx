import './application.scss';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AccountProvider } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { AppContextProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { routes } from '../config/routes';

export function Application(): JSX.Element {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppContextProvider value={{ config: AppConfig }}>
          <AccountProvider config={AppConfig.Account}>
            <AxiosErrorCatcherProvider>
              <DsfrLayout config={AppConfig.Layout} routes={routes} />
            </AxiosErrorCatcherProvider>
          </AccountProvider>
        </AppContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
