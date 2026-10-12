import { useCallback } from 'react';
import { useLoaderData } from 'react-router';

import type { FSAInterface, UUIDType } from '@fc/common';
import { MessageTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';
import { useModal } from '@fc/modal';

import { CorePartnersOptions, PartnersAlertVariants } from '../../enums';
import type { ExternalUrlsInterface, InstanceInterface } from '../../interfaces';
import { PartnersService } from '../../loaders';
import { useDeletionNotifier } from '../deletion-notifier';

export const useServiceProviderSandboxes = () => {
  const { spConfigurationDocUrl } = ConfigService.get<ExternalUrlsInterface>(
    CorePartnersOptions.CONFIG_EXTERNAL_URLS,
  );

  const {
    payload: { linkableInstances },
  } = useLoaderData<Required<FSAInterface<{ linkableInstances: string[] }>>>();
  const hasUnlinkedInstances = linkableInstances.length > 0;

  const { openModal } = useModal();
  const { notifyDeletion } = useDeletionNotifier(PartnersAlertVariants.INSTANCE);

  const confirmDeleteInstance = useCallback(
    async (instanceId: UUIDType, instanceName: string) => {
      try {
        await PartnersService.deleteInstance(instanceId);

        notifyDeletion(
          t('Partners.serviceProviderPage.sandboxes.deleteModal.success.description', {
            instanceName,
          }),
          t('Partners.serviceProviderPage.sandboxes.deleteModal.success.title'),
          MessageTypes.SUCCESS,
        );
      } catch {
        notifyDeletion(
          t('Partners.serviceProviderPage.sandboxes.deleteModal.error.description', {
            instanceName,
          }),
          t('Partners.serviceProviderPage.sandboxes.deleteModal.error.title'),
          MessageTypes.ERROR,
        );
      }
    },
    [notifyDeletion],
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
