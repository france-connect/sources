import type { AxiosResponse } from 'axios';
import type { Dispatch, SetStateAction } from 'react';

import { get } from '@fc/http-client';

import type {
  AccountContextState,
  UserInfosInterface,
  UserInfosValidatorInterface,
} from '../../interfaces';

interface UserInfosFetcherInterface {
  endpoint: string;
  validator: UserInfosValidatorInterface;
  updateState: Dispatch<SetStateAction<AccountContextState<UserInfosInterface>>>;
}

export const fetchUserInfosErrorHandler =
  (updateState: UserInfosFetcherInterface['updateState']) => () => {
    const next = { connected: false, expired: false, ready: true, userinfos: undefined };
    updateState(next);
  };

export const fetchUserInfosSuccessHandler =
  (updateState: UserInfosFetcherInterface['updateState'], validator: UserInfosValidatorInterface) =>
  ({ data }: AxiosResponse<UserInfosInterface>) => {
    const isConnected = !!(data && validator.validate(data));
    const userinfos = (isConnected && data) || undefined;
    const next = { connected: isConnected, expired: false, ready: true, userinfos };
    updateState(next);
  };

export const fetchUserInfos = ({ endpoint, updateState, validator }: UserInfosFetcherInterface) =>
  get<UserInfosInterface>(endpoint)
    .then(fetchUserInfosSuccessHandler(updateState, validator))
    .catch(fetchUserInfosErrorHandler(updateState));
