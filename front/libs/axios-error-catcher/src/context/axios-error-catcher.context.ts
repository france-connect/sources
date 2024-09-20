/* istanbul ignore file */

// declarative file
import React from 'react';

import type { AxiosErrorCatcherInterface } from '../inferfaces';

export const AxiosErrorCatcherContext = React.createContext<AxiosErrorCatcherInterface | undefined>(
  undefined,
);

AxiosErrorCatcherContext.displayName = 'AxiosErrorCatcherContext';
