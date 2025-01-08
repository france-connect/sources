import classnames from 'classnames';
import type { MouseEventHandler } from 'react';
import React from 'react';

import { ButtonTypes, IconPlacement, Priorities, Sizes } from '../../../enums';
import type { ButtonInterface } from '../../../interfaces/button.interface';

export interface SimpleButtonProps extends ButtonInterface {
  title?: string | undefined;
  type?: ButtonTypes | undefined;
  disabled?: boolean | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const SimpleButton = React.memo(
  ({
    children: label,
    className = undefined,
    dataTestId = undefined,
    disabled = undefined,
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
          [`fr-btn--icon-${iconPlacement}`]: !!icon,
          [`fr-icon-${icon}`]: !!icon,
        },
        className,
      )}
      data-testid={dataTestId}
      disabled={disabled}
      title={title}
      type={nativeButtonType}
      onClick={onClick}>
      {label}
    </button>
  ),
);

SimpleButton.displayName = 'SimpleButton';
