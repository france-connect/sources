import './application.scss';

import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { ErrorBoundary } from 'react-error-boundary';

import { AccountProvider, ConnectValidator } from '@fc/account';
import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { ConfigService } from '@fc/config';
import { AppBoundaryComponent } from '@fc/exceptions';
import { I18nService } from '@fc/i18n';
import type { MatomoConfig } from '@fc/matomo';
import { Options, useMatomo } from '@fc/matomo';
import { StylesProvider } from '@fc/styles';

import { AppConfig } from '../config';
import translations from '../fr.i18n.json';
import { ApplicationRoutes } from './application.routes';

export function Application() {
  I18nService.initialize('fr', translations);
  ConfigService.initialize(AppConfig);

  const matomoConfig = ConfigService.get<MatomoConfig>(Options.CONFIG_NAME);
  useMatomo(matomoConfig);

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
