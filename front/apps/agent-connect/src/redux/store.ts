/* istanbul ignore file */

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { IS_DEVELOPMENT } from '../constants';
import { reduxPersistConfig } from './config';
import createRootReducer from './reducers';

const REDUX_MIDDLEWARES = [thunk];

function bindMiddlewares() {
  const appliedMiddlewares = applyMiddleware(...REDUX_MIDDLEWARES);
  if (IS_DEVELOPMENT) {
    const composeEnhancers = composeWithDevTools({});
    return composeEnhancers(appliedMiddlewares);
  }
  return appliedMiddlewares;
}

export const configure = (
  initialState = {},
): { persistor: any; store: any } => {
  const rootReducer = createRootReducer();
  const persistedReducer = persistReducer(reduxPersistConfig, rootReducer);
  const store = createStore(persistedReducer, initialState, bindMiddlewares());
  const persistor = persistStore(store);
  return { persistor, store };
};

export default configure;
