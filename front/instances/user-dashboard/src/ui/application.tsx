import './application.scss';

import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { AccountProvider } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { ConfigService } from '@fc/config';
import { I18nService } from '@fc/i18n';
import { StylesProvider } from '@fc/styles';

import { AppConfig } from '../config';
import translations from '../i18n/fr.json';
import { ApplicationRoutes } from './application.routes';

export function Application() {
  I18nService.initialize('fr', translations);
  ConfigService.initialize(AppConfig);
  return (
    <BrowserRouter>
      <AccountProvider config={AppConfig.Account}>
        <AxiosErrorCatcherProvider>
          <HelmetProvider>
            <StylesProvider>
              <ApplicationRoutes />
            </StylesProvider>
          </HelmetProvider>
        </AxiosErrorCatcherProvider>
      </AccountProvider>
    </BrowserRouter>
  );
}
