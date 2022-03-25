import { useContext, useEffect, useState } from 'react';

import { IdentityProvider } from '@fc/agent-connect-search';

import { AgentConnectHistoryContext } from '../agent-connect-history.context';

export const useUserHistory = (identityProviders: IdentityProvider[]) => {
  const { userHistory } = useContext(AgentConnectHistoryContext);
  const [items, setItems] = useState<IdentityProvider[]>([]);

  useEffect(() => {
    const next = identityProviders.filter((idp) => userHistory.includes(idp.uid));
    setItems(next);
  }, [identityProviders, userHistory]);

  return items;
};
