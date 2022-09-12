/* istanbul ignore file */

// declarative file
import React from 'react';

import { DefaultState } from './interfaces';

export const DEFAULT_CONTEXT_STATE: DefaultState = {
  hasSearched: false,
  payload: {
    csrfToken: '',
    identityProviders: [],
    isLoaded: false,
    ministries: [],
    serviceProviderName: '',
  },
  searchResults: [],
  setSearchTerm: () => {},
};

export const AgentConnectSearchContext = React.createContext<DefaultState>(DEFAULT_CONTEXT_STATE);

AgentConnectSearchContext.displayName = 'AgentConnectSearchContext';
