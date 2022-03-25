import { useCallback, useContext } from 'react';

import { AgentConnectHistoryContext } from '../agent-connect-history.context';

export const useRemoveFromUserHistory = (identityProviderUID: string) => {
  const { setUserHistory, userHistory } = useContext(AgentConnectHistoryContext);

  const removeFromUserHistory = useCallback(() => {
    const next = userHistory.filter((uid) => uid !== identityProviderUID);
    setUserHistory(next);
  }, [identityProviderUID, userHistory, setUserHistory]);

  return removeFromUserHistory;
};
