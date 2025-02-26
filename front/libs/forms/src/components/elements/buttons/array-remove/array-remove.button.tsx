import React from 'react';

import type { PropsWithOnClick } from '@fc/common';
import { Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface ArrayRemoveButtonProps extends Required<PropsWithOnClick> {
  disabled?: boolean;
  dataTestId?: string;
}

export const ArrayRemoveButton = React.memo(
  ({ dataTestId, disabled = false, onClick }: ArrayRemoveButtonProps) => (
    <SimpleButton
      hideLabel
      className="fr-ml-2v"
      dataTestId={dataTestId}
      disabled={disabled}
      icon="delete-line"
      priority={Priorities.TERTIARY}
      title={t('Form.multiple.remove')}
      onClick={onClick}>
      {t('Form.multiple.remove')}
    </SimpleButton>
  ),
);

ArrayRemoveButton.displayName = 'ArrayRemoveButton';
