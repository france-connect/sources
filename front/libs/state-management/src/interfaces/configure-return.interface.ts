/* istanbul ignore file */

// declarative file
import { Store } from 'redux';
import { Persistor } from 'redux-persist';

export interface ConfigureReturn {
  persistor: Persistor;
  store: Store;
}
