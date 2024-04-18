import type { ReactElement } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { AccountConfig, AccountInterface } from '../interfaces';
import { AccountService } from '../services';
import { AccountContext } from './account.context';

export interface AccountProviderProps {
  config: AccountConfig;
  children: ReactElement | ReactElement[];
}

export const AccountProvider = ({ children, config }: AccountProviderProps) => {
  const isMounted = useRef(false);

  const [state, setState] = useState<AccountInterface>({
    connected: false,
    ready: false,
    // @TODO this will be removed using react-redux
    updateAccount: /* istanbul ignore next */ () => {},
    userinfos: {
      firstname: '',
      lastname: '',
    },
  });

  const updateAccount = useCallback(
    (update: Partial<AccountInterface>) => {
      const merge = { ...state, ...update };
      setState(merge);
    },
    [state, setState],
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      AccountService.fetchData(config.endpoints.me, updateAccount);
    }
  }, [config.endpoints.me, updateAccount]);

  return (
    <AccountContext.Provider value={{ ...state, updateAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
