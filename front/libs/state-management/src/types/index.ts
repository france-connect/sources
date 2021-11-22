/* istanbul ignore file */

// declarative file
import { ReducersMapObject, Store } from 'redux';
import { Persistor } from 'redux-persist';

export interface InitialStateType {
  [key: string]: unknown;
}

export interface PersistListType {
  blacklist: string[];
  whitelist: string[];
}

export interface ConfigStatesType {
  [key: string]: {
    blacklist: boolean;
    defaultValue: unknown;
  };
}

export interface ConfigureReturnType {
  persistor: Persistor;
  store: Store;
}

export type StoreProviderContextProps = {
  children: JSX.Element;
  debugMode: boolean;
  middlewares: Function[];
  persistKey: string;
  reducers: ReducersMapObject;
  states: ConfigStatesType;
};
