import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router';

import { IconPlacement, Priorities, Sizes } from '../../../enums';
import type { ButtonInterface } from '../../../interfaces';

export interface LinkButtonProps extends ButtonInterface {
  link: string;
}

export const LinkButton = React.memo(
  ({
    children: label,
    className = undefined,
    dataTestId = undefined,
    icon = undefined,
    iconPlacement = IconPlacement.RIGHT,
    link,
    noOutline = false,
    priority = Priorities.PRIMARY,
    size = Sizes.MEDIUM,
    title = undefined,
  }: LinkButtonProps) => (
    <Link
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
      title={title}
      to={link}>
      {label}
    </Link>
  ),
);

LinkButton.displayName = 'LinkButton';
