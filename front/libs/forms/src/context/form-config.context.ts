import { createContext } from 'react';

import type { FormConfigInterface } from '../interfaces';

export const FormConfigContext = createContext<FormConfigInterface | undefined>(
  undefined as unknown as FormConfigInterface,
);
