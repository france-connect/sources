import React, { useCallback } from 'react';

import { IconPlacement, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { ServiceProviderPermissionInterface } from '../../../interfaces';

interface DeleteContributorButtonProps {
  permission: ServiceProviderPermissionInterface;
  onDelete: (permission: ServiceProviderPermissionInterface) => void;
}

export const DeleteContributorButton = React.memo(
  ({ onDelete, permission }: DeleteContributorButtonProps) => {
    const handleDelete = useCallback(() => {
      onDelete(permission);
    }, [onDelete, permission]);

    return (
      <SimpleButton
        ariaLabel={t('Partners.serviceProviderPage.usersSection.deleteButton.ariaLabel', {
          email: permission.account.email,
        })}
        dataTestId={`service-provider-permissions--delete-${permission.account.id}`}
        icon="delete-line"
        iconPlacement={IconPlacement.LEFT}
        priority={Priorities.SECONDARY}
        onClick={handleDelete}>
        {t('FC.Common.delete')}
      </SimpleButton>
    );
  },
);

DeleteContributorButton.displayName = 'DeleteContributorButton';
