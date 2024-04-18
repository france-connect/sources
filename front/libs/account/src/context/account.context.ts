/* istanbul ignore file */

// declarative file
import React from 'react';

import type { AccountInterface } from '../interfaces';

export const DEFAULT_CONTEXT_STATE: AccountInterface = {
  connected: false,
  ready: false,
  updateAccount: () => {},
  userinfos: undefined,
};

export const AccountContext = React.createContext<AccountInterface>(DEFAULT_CONTEXT_STATE);

AccountContext.displayName = 'AccountContext';
