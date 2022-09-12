/* istanbul ignore file */

// declarative file
import React from 'react';

import { DefaultState } from './interfaces';

export const DEFAULT_CONTEXT_STATE: DefaultState = {
  localStorageKey: '',
  setUserHistory: () => {},
  userHistory: [],
};

export const AgentConnectHistoryContext = React.createContext<DefaultState>(DEFAULT_CONTEXT_STATE);

AgentConnectHistoryContext.displayName = 'AgentConnectHistoryContext';
