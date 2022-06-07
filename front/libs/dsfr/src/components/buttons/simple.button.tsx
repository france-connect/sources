import classnames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

import { IconPlacement, Priorities, Sizes } from '../../enums';

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217284660/Boutons+-+Buttons
  label: string;
  size?: Sizes;
  priority?: Priorities;
  noOutline?: boolean;
  icon?: string;
  iconPlacement?: IconPlacement;
}

export const SimpleButton: React.FC<SimpleButtonProps> = React.memo(
  ({
    disabled,
    icon,
    iconPlacement,
    label,
    noOutline,
    onClick,
    priority,
    size,
    title,
    type: nativeButtonType,
  }: SimpleButtonProps) => (
    <button
      className={classnames(`fr-btn fr-btn--${size}`, {
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
        [`fr-fi-${icon}`]: !!icon,
      })}
      disabled={disabled}
      title={title}
      type={nativeButtonType}
      onClick={onClick}>
      {label}
    </button>
  ),
);

SimpleButton.defaultProps = {
  icon: undefined,
  iconPlacement: IconPlacement.RIGHT,
  noOutline: false,
  priority: Priorities.PRIMARY,
  size: Sizes.MEDIUM,
};

SimpleButton.displayName = 'SimpleButton';
