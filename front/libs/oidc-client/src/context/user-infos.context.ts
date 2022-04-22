/* istanbul ignore file */

// declarative file
import React from 'react';

import { UserInterface } from '../interfaces';

export const DEFAULT_CONTEXT_STATE: UserInterface = {
  connected: false,
  ready: false,
  userinfos: undefined,
};

export const UserInfosContext = React.createContext<UserInterface>(DEFAULT_CONTEXT_STATE);

UserInfosContext.displayName = 'UserInfosContext';
