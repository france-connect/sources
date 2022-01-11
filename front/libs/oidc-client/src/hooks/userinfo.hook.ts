import { useContext } from 'react';

import { useApiGet } from '@fc/common';
import { AppContext, AppContextInterface } from '@fc/state-management';

import { UserInterface } from '../interfaces';

export const useUserinfos = (): UserInterface => {
  const {
    state: { config },
    update,
  } = useContext<AppContextInterface>(AppContext);

  const { getUserInfos } = config.OidcClient.endpoints;
  const user = useApiGet<UserInterface>(
    {
      endpoint: getUserInfos,
    },
    (value: UserInterface) => update({ user: value }),
  );

  return user;
};
