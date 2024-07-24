import classnames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import React from 'react';

import { IconPlacement, Priorities, Sizes } from '../../enums';

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217284660/Boutons+-+Buttons
  className?: string;
  dataTestId?: string;
  label: string;
  size?: Sizes;
  priority?: Priorities;
  noOutline?: boolean;
  icon?: string;
  iconPlacement?: IconPlacement;
}

export const SimpleButton = React.memo(
  ({
    className,
    dataTestId,
    disabled,
    icon,
    iconPlacement = IconPlacement.RIGHT,
    label,
    noOutline = false,
    onClick,
    priority = Priorities.PRIMARY,
    size = Sizes.MEDIUM,
    title,
    type: nativeButtonType,
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
