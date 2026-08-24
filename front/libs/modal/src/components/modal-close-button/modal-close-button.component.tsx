import React from 'react';

import { t } from '@fc/i18n';

interface ModalCloseButtonComponentProps {
  id: string;
  onClose: () => void;
}

export const ModalCloseButtonComponent = React.memo(
  ({ id, onClose }: ModalCloseButtonComponentProps) => (
    <button
      aria-controls={id}
      className="fr-btn--close fr-btn"
      data-testid={`${id}-close-button`}
      title={t('FC.Common.close')}
      type="button"
      onClick={onClose}>
      {t('FC.Common.close')}
    </button>
  ),
);

ModalCloseButtonComponent.displayName = 'ModalCloseButtonComponent';
