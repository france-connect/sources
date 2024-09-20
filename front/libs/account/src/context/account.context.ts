/* istanbul ignore file */

// declarative file
import React from 'react';

import type { AccountContextState } from '../interfaces';

export const AccountContext = React.createContext<AccountContextState | undefined>(undefined);

AccountContext.displayName = 'AccountContext';
