/* istanbul ignore file */

// root application file
import './application.scss';

import { BrowserRouter } from 'react-router-dom';

import { AgentConnectHistoryProvider } from '@fc/agent-connect-history';
import { AgentConnectSearchProvider } from '@fc/agent-connect-search';
import { ApplicationLayout as DsfrLayout } from '@fc/dsfr';
import { ERROR_PATH } from '@fc/routing';
import { AppContextProvider } from '@fc/state-management';

import { API_DATAS_ROUTES, Layout, REDUX_PERSIST_STORAGE_KEY, routes } from '../config';
import * as config from '../config';

export function Application(): JSX.Element {
  return (
    <BrowserRouter>
      <AppContextProvider value={{ config }}>
        <AgentConnectSearchProvider errorRoute={ERROR_PATH} url={API_DATAS_ROUTES}>
          <AgentConnectHistoryProvider localStorageKey={REDUX_PERSIST_STORAGE_KEY}>
            <DsfrLayout config={Layout} routes={routes} />
          </AgentConnectHistoryProvider>
        </AgentConnectSearchProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
}
