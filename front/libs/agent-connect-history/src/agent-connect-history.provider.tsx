import React, { ReactElement, useEffect, useState } from 'react';

import { useLocalStorage } from '@fc/common';

import { AgentConnectHistoryContext } from './agent-connect-history.context';

type AgentConnectHistoryProviderProps = {
  children: ReactElement | ReactElement[];
  localStorageKey: string;
};

export const AgentConnectHistoryProvider = React.memo(
  ({ children, localStorageKey }: AgentConnectHistoryProviderProps): JSX.Element => {
    const { get, set } = useLocalStorage(localStorageKey);

    const [userHistory, setUserHistory] = useState<string[]>(() => {
      const initialState = get('identityProviders') as string[] | undefined;
      return initialState || [];
    });

    useEffect(() => {
      set({ identityProviders: userHistory });
    }, [userHistory, set]);

    return (
      <AgentConnectHistoryContext.Provider value={{ localStorageKey, setUserHistory, userHistory }}>
        {children}
      </AgentConnectHistoryContext.Provider>
    );
  },
);

AgentConnectHistoryProvider.displayName = 'AgentConnectHistoryProvider';
