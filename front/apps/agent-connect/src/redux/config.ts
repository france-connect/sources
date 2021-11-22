/* istanbul ignore file */

// declarative file
import storage from 'redux-persist/lib/storage';

import { REDUX_PERSIST_STORAGE_KEY } from '../constants';

const INITIAL_REDUCERS = {
  reduxPersistBlacklist: {
    ministries: [],
    redirectToIdentityProviderInputs: {},
    redirectURL: '',
    serviceProviderName: '',
  },
  reduxPersistWhitelist: {
    identityProvidersHistory: [],
  },
};

export const reduxPersistConfig = {
  blacklist: Object.keys(INITIAL_REDUCERS.reduxPersistBlacklist),
  key: REDUX_PERSIST_STORAGE_KEY,
  storage,
  whitelist: Object.keys(INITIAL_REDUCERS.reduxPersistWhitelist),
};

export const initialState = {
  ...INITIAL_REDUCERS.reduxPersistBlacklist,
  ...INITIAL_REDUCERS.reduxPersistWhitelist,
};
