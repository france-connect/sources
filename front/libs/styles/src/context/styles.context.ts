/* istanbul ignore file */

// declarative file
import React from 'react';

import type { StylesInterface } from '../interfaces';

export const StylesContext = React.createContext<StylesInterface>(
  null as unknown as StylesInterface,
);

StylesContext.displayName = 'StylesContext';
