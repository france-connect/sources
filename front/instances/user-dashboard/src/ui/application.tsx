import './application.scss';

import { BrowserRouter } from 'react-router-dom';

import { AccountProvider } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { I18nService } from '@fc/i18n';
import { AppContextProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import translations from '../i18n/fr.json';
import { ApplicationRoutes } from './application.routes';

export function Application(): JSX.Element {
  I18nService.initialize('fr', translations);
  return (
    <BrowserRouter>
      <AppContextProvider value={{ config: AppConfig }}>
        <AccountProvider config={AppConfig.Account}>
          <AxiosErrorCatcherProvider>
            <ApplicationRoutes />
          </AxiosErrorCatcherProvider>
        </AccountProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
}
