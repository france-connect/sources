import classnames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

import { IconPlacement, Priorities, Sizes } from '../../enums';

export interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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

export const SimpleButton: React.FC<SimpleButtonProps> = React.memo(
  ({
    className,
    dataTestId,
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
          [`fr-fi-${icon}`]: !!icon,
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

SimpleButton.defaultProps = {
  className: undefined,
  dataTestId: undefined,
  icon: undefined,
  iconPlacement: IconPlacement.RIGHT,
  noOutline: false,
  priority: Priorities.PRIMARY,
  size: Sizes.MEDIUM,
};

SimpleButton.displayName = 'SimpleButton';
