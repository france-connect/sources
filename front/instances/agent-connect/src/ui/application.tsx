/* istanbul ignore file */

// root application file
import './application.scss';

import { BrowserRouter } from 'react-router-dom';

import { AgentConnectHistoryProvider } from '@fc/agent-connect-history';
import { AgentConnectSearchProvider } from '@fc/agent-connect-search';
import { AppContextProvider } from '@fc/state-management';

import * as config from '../config';
import { API_DATAS_ROUTES, API_ERROR_ROUTE, REDUX_PERSIST_STORAGE_KEY } from '../config';
import { ApplicationRoutes } from './application.routes';

export function Application(): JSX.Element {
  return (
    <BrowserRouter>
      <AppContextProvider value={{ config }}>
        <AgentConnectSearchProvider errorRoute={API_ERROR_ROUTE} url={API_DATAS_ROUTES}>
          <AgentConnectHistoryProvider localStorageKey={REDUX_PERSIST_STORAGE_KEY}>
            <ApplicationRoutes />
          </AgentConnectHistoryProvider>
        </AgentConnectSearchProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
}
