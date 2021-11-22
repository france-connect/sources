/* istanbul ignore file */

// root application file
import '@fc/dsfr/styles.scss';

import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { AppContextProvider } from '@fc/state-management';

import { configure, initialState } from './redux';
import routes from './routes';
import { LayoutConfig } from './config';
import * as config from './config';

const { persistor, store } = configure(initialState);

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <AppContextProvider value={{ config }}>
          <DsfrLayout routes={routes} config={LayoutConfig} />
        </AppContextProvider>
      </BrowserRouter>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root'),
);
