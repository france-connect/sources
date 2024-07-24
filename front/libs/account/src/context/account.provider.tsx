import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';

import type { AccountConfig, AccountInterface } from '../interfaces';
import { AccountService } from '../services';
import { AccountContext } from './account.context';

interface AccountProviderProps extends Required<PropsWithChildren> {
  config: AccountConfig;
}

export const AccountProvider = ({ children, config }: AccountProviderProps) => {
  const [state, setState] = useState<AccountInterface>({
    connected: false,
    ready: false,
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
    AccountService.fetchData(config.endpoints.me, updateAccount);
    // @NOTE should be called only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountContext.Provider value={{ ...state, updateAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
