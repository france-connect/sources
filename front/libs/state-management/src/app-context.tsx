/* istanbul ignore file */

// @NOTE refacto needed
// AppContext + useApiGet should be merged
// the `update` is not necessary and migth be outsourced inside AppContext.Consumer
import React, { ReactElement, useState } from 'react';

import { AppContextInterface, AppContextStateInterface } from './interfaces';

export const defaultContext: AppContextStateInterface = {
  config: {},
  user: { connected: false },
};

export const AppContext = React.createContext<AppContextInterface>({
  state: defaultContext,
  update: () => {},
});

export interface AppContextProviderProps {
  value: AppContextStateInterface | Partial<AppContextStateInterface>;
  children: ReactElement[] | ReactElement;
}

export const mergeState = (
  previousState: AppContextStateInterface,
  input: AppContextStateInterface | Partial<AppContextStateInterface>,
) => ({
  ...previousState,
  ...input,
});

export const AppContextProvider = ({ children, value }: AppContextProviderProps) => {
  const [state, setState] = useState<AppContextStateInterface>(() => {
    const defaultStateValue = mergeState(defaultContext, value);
    return defaultStateValue;
  });

  const update = (input: AppContextStateInterface) => {
    const merged = mergeState(state, input);
    setState(merged);
  };

  return <AppContext.Provider value={{ state, update }}>{children}</AppContext.Provider>;
};
