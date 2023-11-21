/* istanbul ignore file */

// declarative file
export const { NODE_ENV, REACT_APP_API_MOCK_DATA_FILE } = process.env;
export const IS_DEVELOPMENT = NODE_ENV === 'development';

// REACT_APP_API_MOCK_DATA_FILE is only used for local development
// out of any docker context !!! SHOULD NOT BE SET IN DOCKER CONFIG !!!
const productionDatasRoute = '/api/v2/ministries-list';
export const API_DATAS_ROUTES =
  (IS_DEVELOPMENT && REACT_APP_API_MOCK_DATA_FILE) || productionDatasRoute;

export const API_ERROR_ROUTE = '/api/v2/error';

export const REDUX_PERSIST_STORAGE_KEY = 'AgentConnect::local::state';

// MONCOMPTEPRO_UID
export const MONCOMPTEPRO_UID = '71144ab3-ee1a-4401-b7b3-79b44f7daeeb';
