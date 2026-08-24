import React from 'react';

import { Align, ButtonGroupComponent, ButtonTypes, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';
import type { ModalContentProps } from '@fc/modal';

import { useDeleteInstanceModalFooter } from '../../../hooks';

export interface DeleteInstanceModalFooterProps extends ModalContentProps {
  onConfirm: () => void | Promise<void>;
}

export const DeleteInstanceModalFooterComponent = React.memo(
  ({ onClose, onConfirm }: DeleteInstanceModalFooterProps) => {
    const { handleConfirm } = useDeleteInstanceModalFooter({ onClose, onConfirm });

    return (
      <ButtonGroupComponent align={Align.RIGHT}>
        <SimpleButton
          dataTestId="delete-instance-modal-cancel-button"
          priority={Priorities.SECONDARY}
          type={ButtonTypes.BUTTON}
          onClick={onClose}>
          {t('FC.Common.cancel')}
        </SimpleButton>
        <SimpleButton
          dataTestId="delete-instance-modal-confirm-button"
          type={ButtonTypes.BUTTON}
          onClick={handleConfirm}>
          {t('Partners.serviceProviderPage.sandboxes.deleteModal.confirm')}
        </SimpleButton>
      </ButtonGroupComponent>
    );
  },
);

DeleteInstanceModalFooterComponent.displayName = 'DeleteInstanceModalFooterComponent';
