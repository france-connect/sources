import './styles/index.scss';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { AppContextProvider } from '@fc/state-management';

import { AppConfig } from '../config';
import { routes } from '../config/routes';

export function Application(): JSX.Element {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppContextProvider value={{ config: AppConfig }}>
          <DsfrLayout config={AppConfig.Layout} routes={routes} />
        </AppContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
