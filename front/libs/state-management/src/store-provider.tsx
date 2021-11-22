/* istanbul ignore file */

// declarative file
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import configure from './configure';
import { StoreProviderContextProps } from './types';

function getStoreProvider({
  children,
  debugMode,
  middlewares,
  persistKey,
  reducers,
  states,
}: StoreProviderContextProps): JSX.Element {
  const { persistor, store } = configure(
    persistKey,
    states,
    reducers,
    middlewares,
    debugMode,
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

const StoreProviderContext = React.memo(getStoreProvider);

StoreProviderContext.displayName = 'StoreProviderContext';

export const StoreProvider = StoreProviderContext;
