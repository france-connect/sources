import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { AppContextProvider } from '@fc/state-management';

import { LayoutConfig } from '../config';
import * as config from '../config';
import { routes } from '../config/routes';

import './styles/index.scss';

export function Application(): JSX.Element {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppContextProvider value={{ config }}>
          <DsfrLayout routes={routes} config={LayoutConfig} />
        </AppContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
