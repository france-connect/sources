import React from 'react';

import type { StylesInterface } from '../interfaces';

export const StylesContext = React.createContext<StylesInterface | undefined>(
  null as unknown as StylesInterface,
);

StylesContext.displayName = 'StylesContext';
