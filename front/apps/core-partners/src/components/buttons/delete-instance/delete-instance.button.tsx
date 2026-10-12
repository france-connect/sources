import React, { useCallback } from 'react';

import { IconPlacement, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { InstanceInterface } from '../../../interfaces';

interface DeleteInstanceButtonProps {
  instance: InstanceInterface;
  onDelete: (instance: InstanceInterface) => void;
}

export const DeleteInstanceButton = React.memo(
  ({ instance, onDelete }: DeleteInstanceButtonProps) => {
    const handleDelete = useCallback(() => {
      onDelete(instance);
    }, [instance, onDelete]);

    return (
      <SimpleButton
        ariaLabel={t('Partners.serviceProviderPage.sandboxes.deleteButton.ariaLabel', {
          instanceName: instance.currentVersion.data.name,
        })}
        dataTestId={`service-provider-sandboxes-table--delete-${instance.id}`}
        icon="delete-line"
        iconPlacement={IconPlacement.LEFT}
        priority={Priorities.SECONDARY}
        onClick={handleDelete}>
        {t('FC.Common.delete')}
      </SimpleButton>
    );
  },
);

DeleteInstanceButton.displayName = 'DeleteInstanceButton';
