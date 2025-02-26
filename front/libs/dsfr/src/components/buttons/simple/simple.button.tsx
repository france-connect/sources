import classnames from 'classnames';
import React from 'react';

import { ButtonTypes, IconPlacement, Priorities, Sizes } from '../../../enums';
import type { ButtonInterface } from '../../../interfaces';

export interface SimpleButtonProps extends ButtonInterface {
  hideLabel?: boolean | undefined;
}

export const SimpleButton = React.memo(
  ({
    children: label = undefined,
    className = undefined,
    dataTestId = undefined,
    disabled = undefined,
    hideLabel = false,
    icon = undefined,
    iconPlacement = IconPlacement.RIGHT,
    noOutline = false,
    onClick = undefined,
    priority = Priorities.PRIMARY,
    size = Sizes.MEDIUM,
    title = undefined,
    type: nativeButtonType = ButtonTypes.BUTTON,
  }: SimpleButtonProps) => (
    <button
      className={classnames(
        `fr-btn fr-btn--${size}`,
        {
          // DSFR classname
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-btn--secondary': priority === Priorities.SECONDARY,
          // DSFR classname
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-btn--tertiary': priority === Priorities.TERTIARY && !noOutline,
          // DSFR classname
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-btn--tertiary-no-outline': priority === Priorities.TERTIARY && noOutline,
          [`fr-btn--icon-${iconPlacement}`]: !!icon && !hideLabel,
          [`fr-icon-${icon}`]: !!icon,
        },
        className,
      )}
      data-testid={dataTestId}
      disabled={disabled}
      title={title}
      type={nativeButtonType}
      onClick={onClick}>
      {!hideLabel && label}
    </button>
  ),
);

SimpleButton.displayName = 'SimpleButton';
