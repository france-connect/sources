import { useCallback } from 'react';
import { useLoaderData } from 'react-router';

import type { FSAInterface, UUIDType } from '@fc/common';
import { MessageTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';
import { useModal } from '@fc/modal';
import { RoutePaths, useNavigateWithState } from '@fc/routing';

import { CorePartnersOptions, PartnersAlertVariants } from '../../enums';
import type { ExternalUrlsInterface, InstanceInterface } from '../../interfaces';
import { PartnersService } from '../../loaders';

export const useServiceProviderSandboxes = () => {
  const { spConfigurationDocUrl } = ConfigService.get<ExternalUrlsInterface>(
    CorePartnersOptions.CONFIG_EXTERNAL_URLS,
  );

  const {
    payload: { linkableInstances },
  } = useLoaderData<Required<FSAInterface<{ linkableInstances: string[] }>>>();
  const hasUnlinkedInstances = linkableInstances.length > 0;

  const { openModal } = useModal();
  const { navigateWithState } = useNavigateWithState();

  const confirmDeleteInstance = useCallback(
    async (instanceId: UUIDType, instanceName: string) => {
      try {
        await PartnersService.deleteInstance(instanceId);

        // @NOTE navigating to the current route replays the loaders,
        // the sandboxes list is refreshed and the SandboxAlert renders the route state
        navigateWithState(
          RoutePaths.CURRENT,
          {
            message: t('Partners.serviceProviderPage.sandboxes.deleteModal.success.description', {
              instanceName,
            }),
            title: t('Partners.serviceProviderPage.sandboxes.deleteModal.success.title'),
            type: MessageTypes.SUCCESS,
            variant: PartnersAlertVariants.INSTANCE,
          },
          true,
        );
      } catch {
        navigateWithState(
          RoutePaths.CURRENT,
          {
            message: t('Partners.serviceProviderPage.sandboxes.deleteModal.error.description', {
              instanceName,
            }),
            title: t('Partners.serviceProviderPage.sandboxes.deleteModal.error.title'),
            type: MessageTypes.ERROR,
            variant: PartnersAlertVariants.INSTANCE,
          },
          true,
        );
      }
    },
    [navigateWithState],
  );

  const deleteInstanceHandler = useCallback(
    (instance: InstanceInterface) => {
      const instanceId = instance.id;
      const instanceName = instance.currentVersion.data.name;
      const onConfirm = () => confirmDeleteInstance(instanceId, instanceName);

      openModal('delete-instance', { instanceName, onConfirm });
    },
    [confirmDeleteInstance, openModal],
  );

  return {
    confirmDeleteInstance,
    deleteInstanceHandler,
    hasUnlinkedInstances,
    spConfigurationDocUrl,
  };
};
