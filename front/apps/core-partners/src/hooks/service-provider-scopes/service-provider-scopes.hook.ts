import { useMemo } from 'react';

import { ConfigService } from '@fc/config';

import { CorePartnersOptions } from '../../enums';
import type { ExternalUrlsInterface } from '../../interfaces';

export const useServiceProviderScopes = (datapassScopes: string[], fcScopes: string[]) => {
  const { datapassDocUrl, scopeDocUrl } = ConfigService.get<ExternalUrlsInterface>(
    CorePartnersOptions.CONFIG_EXTERNAL_URLS,
  );

  const tabLists = useMemo(
    () => [
      {
        id: 'datapass',
        scopes: datapassScopes,
      },
      {
        id: 'fc',
        scopes: fcScopes,
      },
    ],
    [datapassScopes, fcScopes],
  );

  return {
    datapassDocUrl,
    scopeDocUrl,
    tabLists,
  };
};
