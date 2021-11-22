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
  input: any,
) => ({
  ...previousState,
  ...input,
});

export const AppContextProvider = ({
  value,
  children,
}: AppContextProviderProps) => {
  const [state, setState] = useState<AppContextStateInterface>(
    mergeState(defaultContext, value),
  );

  const update = (input: AppContextStateInterface) => {
    setState(mergeState(state, input));
  };

  return (
    <AppContext.Provider value={{ state, update }}>
      {children}
    </AppContext.Provider>
  );
};
