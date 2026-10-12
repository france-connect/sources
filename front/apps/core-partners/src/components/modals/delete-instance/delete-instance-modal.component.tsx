import React from 'react';

import { t } from '@fc/i18n';
import { type ModalContentProps, ModalShellComponent } from '@fc/modal';

export interface DeleteInstanceModalProps extends ModalContentProps {
  instanceName: string;
  onConfirm: () => void | Promise<void>;
}

export const DeleteInstanceModalComponent = React.memo(
  ({ id, instanceName, onClose, onConfirm }: DeleteInstanceModalProps) => (
    <ModalShellComponent
      id={id}
      title={t('Partners.serviceProviderPage.sandboxes.deleteModal.title')}
      onClose={onClose}
      onConfirm={onConfirm}>
      <p>{t('Partners.serviceProviderPage.sandboxes.deleteModal.description', { instanceName })}</p>
    </ModalShellComponent>
  ),
);

DeleteInstanceModalComponent.displayName = 'DeleteInstanceModalComponent';
