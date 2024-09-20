import './application.scss';

import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { AccountProvider, ConnectValidator } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { ConfigService } from '@fc/config';
import { AppBoundaryComponent } from '@fc/exceptions';
import { I18nService } from '@fc/i18n';
import { StylesProvider } from '@fc/styles';

import { AppConfig } from '../config';
import translations from '../i18n/fr.json';
import { ApplicationRoutes } from './application.routes';

export function Application() {
  I18nService.initialize('fr', translations);
  ConfigService.initialize(AppConfig);
  return (
    <ErrorBoundary FallbackComponent={AppBoundaryComponent}>
      <AxiosErrorCatcherProvider>
        <AccountProvider validator={ConnectValidator}>
          <HelmetProvider>
            <StylesProvider>
              <ApplicationRoutes />
            </StylesProvider>
          </HelmetProvider>
        </AccountProvider>
      </AxiosErrorCatcherProvider>
    </ErrorBoundary>
  );
}
