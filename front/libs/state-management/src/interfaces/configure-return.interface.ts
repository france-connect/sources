/* istanbul ignore file */

// declarative file
import type { Store } from 'redux';
import type { Persistor } from 'redux-persist';

export interface ConfigureReturn {
  persistor: Persistor;
  store: Store;
}
