import React from 'react';

import type { ModalContextStateInterface } from '../interfaces';

export const ModalContext = React.createContext<ModalContextStateInterface | undefined>(undefined);

ModalContext.displayName = 'ModalContext';
