import { useMemo } from 'react';
import { generatePath } from 'react-router';

import { ConfigService } from '@fc/config';

import { CorePartnersOptions } from '../../enums';
import type { ExternalUrlsInterface } from '../../interfaces';

export const useServiceProviderDatapass = (datapassRequestId: string) => {
  const { datapassBaseUrl, datapassHabilitationPathname } =
    ConfigService.get<ExternalUrlsInterface>(CorePartnersOptions.CONFIG_EXTERNAL_URLS);

  const habilitationLink = useMemo(() => {
    const pathname = generatePath(datapassHabilitationPathname, {
      id: datapassRequestId,
    });

    return `${datapassBaseUrl}${pathname}`;
  }, [datapassBaseUrl, datapassHabilitationPathname, datapassRequestId]);

  return {
    habilitationLink,
  };
};
