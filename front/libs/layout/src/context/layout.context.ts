/* istanbul ignore file */

// declarative file
import React from 'react';

import type { LayoutContextState } from '../interfaces';

export const LayoutContext = React.createContext<LayoutContextState | undefined>(undefined);

LayoutContext.displayName = 'LayoutContext';
