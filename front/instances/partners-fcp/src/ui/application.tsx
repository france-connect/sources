import './application.scss';

import { BrowserRouter } from 'react-router-dom';

import { AccountProvider } from '@fc/account';
import { ConfigService } from '@fc/config';
import { ErrorBoundaryComponent } from '@fc/error-boundary';
import { I18nService } from '@fc/i18n';
import { PartnersConfig } from '@fc/partners';
import { AppContextProvider, StoreProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import translations from '../i18n/fr.json';
import { reducersMap, sideEffectsMiddleware, statesMap } from '../store';
import { ApplicationRoutes } from './application.routes';

export const onErrorHandler = (err: Error) => {
  // @NOTE this function + console.warn would have to been removed
  // it's has been implemented for development purpose
  console.warn(err); // eslint-disable-line no-console
};

export function Application(): JSX.Element {
  // @TODO ConfigService + I8NService should be moved
  // to a context provider
  // PROS:
  //   - i18n update rendering on locales changes
  //   - services initialization are currently outside the error boundary component
  // CONS:
  //   - ~~because of React.StrictMode, it will be initialized twice~~ -> Resolved
  //      react.StrictMode has been moved to index.ts file
  I18nService.initialize('fr', translations);
  ConfigService.initialize(AppConfig);
  const { persistKey } = ConfigService.get<PartnersConfig>('Application');

  return (
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
              <ApplicationRoutes />
            </AccountProvider>
          </AppContextProvider>
        </StoreProvider>
      </ErrorBoundaryComponent>
    </BrowserRouter>
  );
}
