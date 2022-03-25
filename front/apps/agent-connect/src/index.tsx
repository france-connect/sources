/* istanbul ignore file */

// root application file
import '@fc/dsfr/styles.scss';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { AgentConnectHistoryProvider } from '@fc/agent-connect-history';
import { AgentConnectSearchProvider } from '@fc/agent-connect-search';
import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { ERROR_PATH } from '@fc/routing';
import { AppContextProvider } from '@fc/state-management';

import { Layout } from './config';
import * as config from './config';
import { API_DATAS_ROUTES, REDUX_PERSIST_STORAGE_KEY } from './constants';
import { routes } from './routes';

ReactDOM.render(
  <BrowserRouter>
    <AppContextProvider value={{ config }}>
      <AgentConnectSearchProvider errorRoute={ERROR_PATH} url={API_DATAS_ROUTES}>
        <AgentConnectHistoryProvider localStorageKey={REDUX_PERSIST_STORAGE_KEY}>
          <DsfrLayout config={Layout} routes={routes} />
        </AgentConnectHistoryProvider>
      </AgentConnectSearchProvider>
    </AppContextProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
