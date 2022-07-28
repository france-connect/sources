/* istanbul ignore file */

// declarative file
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { configure } from './configure';
import { GlobalState, StoreProviderProps } from './interfaces';

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
