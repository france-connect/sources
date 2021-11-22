import { applyMiddleware, StoreEnhancer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const bindMiddlewares = (
  middlewares: any,
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

export default bindMiddlewares;
