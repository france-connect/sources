import './application.scss';

import { AxiosErrorCatcherProvider } from '@fc/axios-error-catcher';
import { AppContextProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { ApplicationRoutes } from './application.routes';

export function Application(): JSX.Element {
  return (
    <AppContextProvider value={{ config: AppConfig }}>
      <AxiosErrorCatcherProvider>
        <ApplicationRoutes />
      </AxiosErrorCatcherProvider>
    </AppContextProvider>
  );
}
