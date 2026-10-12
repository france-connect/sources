import React from 'react';

import { t } from '@fc/i18n';
import { type ModalContentProps, ModalShellComponent } from '@fc/modal';

export interface DeleteContributorModalProps extends ModalContentProps {
  email: string;
  onConfirm: () => void | Promise<void>;
}

export const DeleteContributorModalComponent = React.memo(
  ({ email, id, onClose, onConfirm }: DeleteContributorModalProps) => (
    <ModalShellComponent
      id={id}
      title={t('Partners.serviceProviderPage.usersSection.deleteModal.title')}
      onClose={onClose}
      onConfirm={onConfirm}>
      <p>{t('Partners.serviceProviderPage.usersSection.deleteModal.description', { email })}</p>
    </ModalShellComponent>
  ),
);

DeleteContributorModalComponent.displayName = 'DeleteContributorModalComponent';
