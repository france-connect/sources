import type { Middleware, StoreEnhancer } from 'redux';
import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

export const bindMiddlewares = (
  middlewares: Middleware[],
  useReduxDevToolsExtension: boolean,
): StoreEnhancer => {
  const appliedMiddlewares = applyMiddleware(...middlewares);
  if (!useReduxDevToolsExtension) {
    return appliedMiddlewares;
  }
  const composeEnhancers = composeWithDevTools({ trace: true });
  const composed = composeEnhancers(appliedMiddlewares);
  return composed;
};
