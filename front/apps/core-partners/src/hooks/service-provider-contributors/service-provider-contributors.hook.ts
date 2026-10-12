import { useCallback } from 'react';
import { useParams } from 'react-router';

import type { UUIDType } from '@fc/common';
import { MessageTypes } from '@fc/common';
import { t } from '@fc/i18n';
import { useModal } from '@fc/modal';

import { PartnersAlertVariants } from '../../enums';
import type { ServiceProviderPermissionInterface } from '../../interfaces';
import { PartnersService } from '../../loaders';
import { useDeletionNotifier } from '../deletion-notifier';

export const useServiceProviderContributors = () => {
  const { serviceProviderId } = useParams<{ serviceProviderId: string }>();

  const { openModal } = useModal();
  const { notifyDeletion } = useDeletionNotifier(PartnersAlertVariants.CONTRIBUTOR);

  const confirmDeleteContributor = useCallback(
    async (accountId: UUIDType, email: string) => {
      try {
        await PartnersService.deleteContributor(serviceProviderId as UUIDType, accountId);

        notifyDeletion(
          t('Partners.serviceProviderPage.usersSection.deleteModal.success.description', { email }),
          t('Partners.serviceProviderPage.usersSection.deleteModal.success.title'),
          MessageTypes.SUCCESS,
        );
      } catch {
        notifyDeletion(
          t('Partners.serviceProviderPage.usersSection.deleteModal.error.description', { email }),
          t('Partners.serviceProviderPage.usersSection.deleteModal.error.title'),
          MessageTypes.ERROR,
        );
      }
    },
    [serviceProviderId, notifyDeletion],
  );

  const deleteContributorHandler = useCallback(
    (permission: ServiceProviderPermissionInterface) => {
      const { email, id } = permission.account;

      openModal('delete-contributor', {
        email,
        onConfirm: () => confirmDeleteContributor(id, email),
      });
    },
    [confirmDeleteContributor, openModal],
  );

  return {
    confirmDeleteContributor,
    deleteContributorHandler,
  };
};
