import { combineReducers, createStore, ReducersMapObject } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bindMiddlewares from './bind-middlewares';
import getInitialState from './get-initial-state';
import getPersistLists from './get-persist-lists';
import { ConfigStatesType, ConfigureReturnType } from './types';

const configure = (
  key: string,
  states: ConfigStatesType,
  reducers: ReducersMapObject,
  middlewares: Function[] = [],
  shouldUseStoreDebug: boolean = false,
): ConfigureReturnType => {
  const initialState = getInitialState(states);
  const createRootReducers = combineReducers(reducers);

  const persistLists = getPersistLists(states);
  const persistConfig = { key, storage, ...persistLists };
  const persistedReducers = persistReducer(persistConfig, createRootReducers);

  const bindedMiddlewares = bindMiddlewares(
    middlewares as any,
    shouldUseStoreDebug,
  );
  const store = createStore(persistedReducers, initialState, bindedMiddlewares);
  const persistor = persistStore(store);
  return { persistor, store };
};

export default configure;
