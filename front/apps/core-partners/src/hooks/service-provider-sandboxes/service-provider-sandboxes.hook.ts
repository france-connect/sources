import { useLoaderData } from 'react-router';

import type { FSAInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import { useCleanupRouteState } from '@fc/routing';

import { CorePartnersOptions } from '../../enums';
import type { ExternalUrlsInterface, LocationWithSubmitStateInterface } from '../../interfaces';

export const useServiceProviderSandboxes = () => {
  const { spConfigurationDocUrl } = ConfigService.get<ExternalUrlsInterface>(
    CorePartnersOptions.CONFIG_EXTERNAL_URLS,
  );

  const {
    payload: { linkableInstances },
  } = useLoaderData<Required<FSAInterface<{ linkableInstances: string[] }>>>();
  const hasUnlinkedInstances = linkableInstances.length > 0;

  const { cleanupRouteState, state: submitState } =
    useCleanupRouteState<LocationWithSubmitStateInterface>();

  return {
    cleanupRouteState,
    hasUnlinkedInstances,
    spConfigurationDocUrl,
    submitState,
  };
};
