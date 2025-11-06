import { createContext } from 'react';

import type { Dto2FormServiceContextInterface } from '../interfaces';

export const Dto2FormServiceContext = createContext<Dto2FormServiceContextInterface | undefined>(
  undefined,
);
