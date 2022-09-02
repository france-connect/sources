/* istanbul ignore file */

// declarative file
import React from 'react';

import { AxiosErrorCatcher } from '../inferfaces';

export const DEFAULT_CONTEXT_STATE: AxiosErrorCatcher = {
  codeError: undefined,
  hasError: false,
};

export const AxiosErrorCatcherContext =
  React.createContext<AxiosErrorCatcher>(DEFAULT_CONTEXT_STATE);

AxiosErrorCatcherContext.displayName = 'AxiosErrorCatcherContext';
