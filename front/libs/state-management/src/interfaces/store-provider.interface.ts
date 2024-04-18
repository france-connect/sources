/* istanbul ignore file */

// declarative file
import type { ReducersMapObject } from 'redux';

import type { GlobalState } from './global-state.interface';

export interface StoreProviderProps<S extends GlobalState> {
  children: JSX.Element;
  debugMode: boolean;
  middlewares: Function[];
  persistKey: string;
  reducers: ReducersMapObject;
  states: S;
}
