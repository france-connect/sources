import { applyMiddleware, Middleware, StoreEnhancer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

export const bindMiddlewares = (
  middlewares: Middleware[],
  useReduxDevToolsExtension: boolean,
): StoreEnhancer => {
  const appliedMiddlewares = applyMiddleware(...middlewares);
  if (!useReduxDevToolsExtension) {
    return appliedMiddlewares;
  }
  const composeEnhancers = composeWithDevTools({});
  const composed = composeEnhancers(appliedMiddlewares);
  return composed;
};
