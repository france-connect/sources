import React from 'react';

import { t } from '@fc/i18n';

export interface DeleteInstanceModalProps {
  instanceName: string;
}

export const DeleteInstanceModalComponent = React.memo(
  ({ instanceName }: DeleteInstanceModalProps) => (
    <p>{t('Partners.serviceProviderPage.sandboxes.deleteModal.description', { instanceName })}</p>
  ),
);

DeleteInstanceModalComponent.displayName = 'DeleteInstanceModalComponent';
