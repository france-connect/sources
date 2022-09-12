import { useCallback, useContext } from 'react';

import { useLocalStorage } from '@fc/common';

import { AgentConnectHistoryContext } from '../agent-connect-history.context';

export const useAddToUserHistory = (identityProviderUID: string) => {
  const { localStorageKey } = useContext(AgentConnectHistoryContext);
  const { get, set } = useLocalStorage(localStorageKey);

  const addToUserHistory = useCallback(() => {
    const current = (get('identityProviders') as string[]) || [];
    const isIncluded = current.includes(identityProviderUID);
    if (!current || !isIncluded) {
      const sliced = current.slice(0, 2);
      const next = [identityProviderUID, ...sliced];
      set({ identityProviders: next });
    }
  }, [identityProviderUID, get, set]);

  return addToUserHistory;
};
