import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { UserInterface } from '../interfaces';
import { UserInfosService } from '../services';
import { UserInfosContext } from './user-infos.context';

export type UserInfosProviderProps = {
  userInfosEndpoint: string;
  children: ReactElement | ReactElement[];
};

export const UserInfosProvider = ({ children, userInfosEndpoint }: UserInfosProviderProps) => {
  const isMounted = useRef(false);
  const [state, setState] = useState<UserInterface>({
    connected: false,
    ready: false,
    userinfos: undefined,
  });

  /* @NOTE can not be mocked without a native re-implementation */
  /* istanbul ignore next */
  const fetchDataCallback = useCallback((update) => {
    /* @NOTE can not be mocked without a native re-implementation */
    /* istanbul ignore next */
    setState((prev) => ({ ...prev, ...update }));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      UserInfosService.fetchData(userInfosEndpoint, fetchDataCallback);
    }
  }, [userInfosEndpoint, fetchDataCallback]);

  return <UserInfosContext.Provider value={{ ...state }}>{children}</UserInfosContext.Provider>;
};

UserInfosProvider.displayName = 'UserInfosProvider';
