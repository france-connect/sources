import './application.scss';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AccountProvider } from '@fc/account';
import { ConfigService } from '@fc/config';
import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { ErrorBoundaryComponent } from '@fc/error-boundary';
import { I18nService } from '@fc/i18n';
import { AppContextProvider, StoreProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { routes } from '../config/routes';
import translations from '../i18n/fr.json';
import { reducersMap, sideEffectsMiddleware, statesMap } from '../store';

export const onErrorHandler = (err: Error) => {
  // @NOTE this function + console.warn would have to been removed
  // it's has been implemented for development purpose
  console.warn(err); // eslint-disable-line no-console
};

export function Application(): JSX.Element {
  // @TODO ConfigService + I8NService should be moved
  // to a context provider
  // PROS:
  //  - i18n update rendering on locales changes
  I18nService.initialize('fr', translations);
  ConfigService.initialize(AppConfig);
  const { persistKey } = ConfigService.get('Application');

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ErrorBoundaryComponent onError={onErrorHandler}>
          <StoreProvider<typeof statesMap>
            debugMode={process.env.NODE_ENV !== 'production'}
            middlewares={[sideEffectsMiddleware]}
            persistKey={persistKey}
            reducers={reducersMap}
            states={statesMap}>
            <AppContextProvider value={{ config: AppConfig }}>
              <AccountProvider config={AppConfig.Account}>
                <DsfrLayout config={AppConfig.Layout} routes={routes} />
              </AccountProvider>
            </AppContextProvider>
          </StoreProvider>
        </ErrorBoundaryComponent>
      </BrowserRouter>
    </React.StrictMode>
  );
}
