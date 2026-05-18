import { useCallback } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';

import type { FSAInterface } from '@fc/common';
import type { InstanceInterface } from '@fc/core-partners';

import type { LocationWithSubmitStateType } from '../../interfaces';

export const useInstances = () => {
  const navigate = useNavigate();
  const location = useLocation() as LocationWithSubmitStateType;
  const response = useLoaderData();

  // @NOTE DEV : should be merged and renamed into a generic hook with
  // instances/partners/src/hooks/instances/instances-page.hook.ts
  // Ex : hook named as useCleanupRouteState
  const closeAlertHandler = useCallback(() => {
    // @NOTE onCloseAlert
    // reload the page without the submit state
    // act like any URL with a search query `?<key>=<value>&`
    // do not replace the current entry in the history stack
    navigate('.', { replace: false, state: undefined });
  }, [navigate]);

  const { payload } = response as Required<FSAInterface<InstanceInterface[]>>;
  const hasItems = !!(payload && payload.length);

  const submitState = location.state?.submitState || undefined;

  return { closeAlertHandler, hasItems, items: payload, submitState };
};
