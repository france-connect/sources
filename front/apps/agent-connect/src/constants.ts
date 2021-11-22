/* istanbul ignore file */

// declarative file
const productionDatasRoute = '/api/v2/ministries-list';

export const { NODE_ENV, REACT_APP_API_MOCK_DATA_FILE } = process.env;
export const IS_DEVELOPMENT = NODE_ENV === 'development';

// REACT_APP_API_MOCK_DATA_FILE is only used for local development
// out of any docker context !!! SHOULD NOT BE SET IN DOCKER CONFIG !!!
export const API_DATAS_ROUTES =
  (IS_DEVELOPMENT && REACT_APP_API_MOCK_DATA_FILE) || productionDatasRoute;

export const REDUX_PERSIST_STORAGE_KEY = 'AgentConnect::local::state';

export const ACTION_TYPES = {
  IDENTITY_PROVIDER_ADD: 'IDENTITY_PROVIDER_ADD',
  IDENTITY_PROVIDER_REMOVE: 'IDENTITY_PROVIDER_REMOVE',
  MINISTRY_LIST_LOAD_COMPLETED: 'MINISTRY_LIST_LOAD_COMPLETED',
  MINISTRY_LIST_LOAD_START: 'MINISTRY_LIST_LOAD_START',
};
