import { type PropsWithChildren, useEffect, useState } from 'react';

import { AxiosErrorCatcherContext } from '@fc/axios-error-catcher';
import type { AxiosErrorCatcherInterface } from '@fc/axios-error-catcher/src/inferfaces';
import { HttpStatusCode, useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';

import { Options } from '../enums';
import type {
  AccountConfig,
  AccountContextState,
  UserInfosValidatorInterface,
} from '../interfaces';
import { fetchUserInfos } from '../services';
import { AccountContext } from './account.context';

interface AccountProviderProps extends Required<PropsWithChildren> {
  validator: UserInfosValidatorInterface;
}

export const AccountProvider = ({ children, validator }: AccountProviderProps) => {
  const { endpoints } = ConfigService.get<AccountConfig>(Options.CONFIG_NAME);

  const { codeError, hasError } =
    useSafeContext<AxiosErrorCatcherInterface>(AxiosErrorCatcherContext);

  const [account, setAccount] = useState<AccountContextState>({
    connected: false,
    expired: false,
    ready: false,
    userinfos: undefined,
  });

  useEffect(() => {
    fetchUserInfos({ endpoint: endpoints.me, updateState: setAccount, validator });
    // @NOTE should be called only at first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sessionHasExpired = account.connected && codeError === HttpStatusCode.UNAUTHORIZED;
    const shouldUpdateState = sessionHasExpired && !account.expired;
    if (shouldUpdateState) {
      setAccount({ connected: false, expired: true, ready: true, userinfos: undefined });
    }
  }, [account.expired, account.connected, codeError, hasError]);

  return <AccountContext.Provider value={account}>{children}</AccountContext.Provider>;
};
