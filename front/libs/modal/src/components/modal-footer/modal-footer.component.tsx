import React from 'react';

import { Align, ButtonGroupComponent, ButtonTypes, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useModalFooter } from '../../hooks';

export interface ModalFooterProps {
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const ModalFooterComponent = React.memo(({ onClose, onConfirm }: ModalFooterProps) => {
  const { handleConfirm } = useModalFooter({ onClose, onConfirm });

  return (
    <div className="fr-modal__footer">
      <ButtonGroupComponent align={Align.RIGHT}>
        <SimpleButton
          dataTestId="modal-cancel-button"
          priority={Priorities.SECONDARY}
          type={ButtonTypes.BUTTON}
          onClick={onClose}>
          {t('FC.Common.cancel')}
        </SimpleButton>
        <SimpleButton
          dataTestId="modal-confirm-button"
          type={ButtonTypes.BUTTON}
          onClick={handleConfirm}>
          {t('FC.Common.confirm')}
        </SimpleButton>
      </ButtonGroupComponent>
    </div>
  );
});

ModalFooterComponent.displayName = 'ModalFooterComponent';
