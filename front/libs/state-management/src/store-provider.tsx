/* istanbul ignore file */

// declarative file
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { configure } from './configure';
import type { GlobalState, StoreProviderProps } from './interfaces';

function getStoreProvider<S extends GlobalState = GlobalState<unknown>>({
  children,
  debugMode,
  middlewares,
  persistKey,
  reducers,
  states,
}: StoreProviderProps<S>): JSX.Element {
  const { persistor, store } = configure<S>(persistKey, states, reducers, middlewares, debugMode);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export const StoreProvider = getStoreProvider;
