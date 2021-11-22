import { useContext } from 'react';
import { useApiGet } from '@fc/common';
import { AppContextInterface, AppContext } from '@fc/state-management';

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
    (user: UserInterface) => update({ user }),
  );

  return user;
};
