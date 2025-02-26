import React from 'react';

import type { PropsWithOnClick } from '@fc/common';
import { Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface ClipboardButtonProps extends Required<PropsWithOnClick> {
  disabled?: boolean;
  dataTestId?: string;
}

export const ClipboardButton = React.memo(
  ({ dataTestId, disabled = false, onClick }: ClipboardButtonProps) => (
    <SimpleButton
      className="fr-ml-2v"
      dataTestId={dataTestId}
      disabled={disabled}
      priority={Priorities.SECONDARY}
      title={t('Form.button.copy')}
      onClick={onClick}>
      {t('Form.button.copy')}
    </SimpleButton>
  ),
);

ClipboardButton.displayName = 'ClipboardButton';
