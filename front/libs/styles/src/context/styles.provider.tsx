import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { StylesContext } from './styles.context';

export interface StylesProviderProps extends PropsWithChildren {
  nodeTarget?: string;
}

export const StylesProvider = ({ children, nodeTarget = 'html' }: StylesProviderProps) => {
  const [cssVariables, setCssVariables] = useState<CSSStyleDeclaration>();

  useEffect(() => {
    const root = document.documentElement;
    const results = getComputedStyle(root, nodeTarget);
    setCssVariables(results);
  }, [nodeTarget]);

  return <StylesContext.Provider value={{ cssVariables }}>{children}</StylesContext.Provider>;
};
