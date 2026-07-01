import { useLoaderData } from 'react-router';

import type { FSAInterface } from '@fc/common';
import type { InstanceInterface, LocationWithSubmitStateInterface } from '@fc/core-partners';
import { useCleanupRouteState } from '@fc/routing';

export const useInstances = () => {
  const response = useLoaderData();

  const { cleanupRouteState, state } = useCleanupRouteState<LocationWithSubmitStateInterface>();

  const { payload } = response as Required<FSAInterface<InstanceInterface[]>>;
  const hasItems = !!(payload && payload.length);

  return { cleanupRouteState, hasItems, items: payload, submitState: state };
};
