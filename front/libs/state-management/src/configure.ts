import type { Middleware, Reducer, ReducersMapObject, Store } from 'redux';
import { legacy_createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import type { FSA } from '@fc/common';

import { bindMiddlewares } from './bind-middlewares';
import { getInitialState } from './get-initial-state';
import type { ConfigureReturn, GlobalState } from './interfaces';
import { mapReducers } from './map-reducers';
import { getPersistLists } from './middlewares';

export const configure = <S extends GlobalState>(
  key: string,
  states: S,
  reducers: ReducersMapObject,
  middlewares: Function[] = [],
  shouldUseStoreDebug: boolean = false,
): ConfigureReturn => {
  const initialState = getInitialState<S>(states);
  const createRootReducers: Reducer = mapReducers<S>(reducers);

  const persistLists = getPersistLists<S>(states);
  const persistConfig = { key, storage, ...persistLists };
  const persistedReducers: Reducer = persistReducer<S>(persistConfig, createRootReducers);

  const bindedMiddlewares = bindMiddlewares(middlewares as Middleware[], shouldUseStoreDebug);
  const store: Store<S, FSA> = legacy_createStore(
    persistedReducers,
    initialState,
    bindedMiddlewares,
  );
  const persistor = persistStore(store);
  return { persistor, store };
};
