import React from 'react';

import type { PropsWithOnClick } from '@fc/common';
import { IconPlacement, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface ArrayAddButtonProps extends Required<PropsWithOnClick> {
  disabled?: boolean;
  dataTestId?: string;
}

export const ArrayAddButton = React.memo(
  ({ dataTestId = undefined, disabled = false, onClick }: ArrayAddButtonProps) => (
    <SimpleButton
      className="fr-mt-2v"
      dataTestId={dataTestId}
      disabled={disabled}
      icon="add-line"
      iconPlacement={IconPlacement.LEFT}
      priority={Priorities.TERTIARY}
      title={t('Form.multiple.add')}
      onClick={onClick}>
      {t('Form.multiple.add')}
    </SimpleButton>
  ),
);

ArrayAddButton.displayName = 'ArrayAddButton';
