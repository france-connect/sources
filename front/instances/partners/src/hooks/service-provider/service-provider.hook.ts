import { useCallback } from 'react';
import { generatePath, useLoaderData, useLocation, useNavigate } from 'react-router';

import type { FSAInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { ExternalUrlsInterface, ServiceProviderInterface } from '@fc/core-partners';
import { CorePartnersOptions } from '@fc/core-partners';

import type { LocationWithSubmitStateType } from '../../interfaces';

interface ServiceProviderPageLoaderDataInterface extends ServiceProviderInterface {
  hasUnlinkedInstances: boolean;
}

export const useServiceProvider = () => {
  const navigate = useNavigate();
  const location = useLocation() as LocationWithSubmitStateType;
  const { datapassBaseUrl, datapassHabilitationPathname } =
    ConfigService.get<ExternalUrlsInterface>(CorePartnersOptions.CONFIG_EXTERNAL_URLS);

  // @NOTE DEV : should be merged and renamed into a generic hook with
  // instances/partners/src/hooks/instances/instances-page.hook.ts
  // Ex : hook named as useCleanupRouteState
  const closeAlertHandler = useCallback(() => {
    navigate('.', { replace: false, state: undefined });
  }, [navigate]);

  const response = useLoaderData();
  const { payload } = response as Required<FSAInterface<ServiceProviderPageLoaderDataInterface>>;

  const {
    datapassRequestId,
    datapassScopes,
    fcScopes,
    hasUnlinkedInstances,
    id,
    instances,
    name,
    organization,
  } = payload;
  const pathname = generatePath(datapassHabilitationPathname, {
    id: datapassRequestId,
  });
  const habilitationLink = `${datapassBaseUrl}${pathname}`;
  const submitState = location.state?.submitState || undefined;

  return {
    closeAlertHandler,
    datapassRequestId,
    datapassScopes,
    fcScopes,
    habilitationLink,
    hasUnlinkedInstances,
    id,
    instances,
    name,
    organization,
    submitState,
  };
};
