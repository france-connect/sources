import type { Context } from 'react';

import { useSafeContext } from '@fc/common';

import { AccountContext } from '../context/account.context';
import type { AccountContextState, UserInfosInterface } from '../interfaces';

export function useAccountContext<
  U extends UserInfosInterface = UserInfosInterface,
>(): AccountContextState<U> {
  const value = useSafeContext<AccountContextState<U>>(
    AccountContext as unknown as Context<AccountContextState<U> | undefined>,
  );

  return value;
}
