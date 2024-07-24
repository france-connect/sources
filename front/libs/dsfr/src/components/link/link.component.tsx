import classnames from 'classnames';
import React from 'react';

import { IconPlacement, Sizes } from '../../enums';

interface LinkComponentProps {
  className?: string;
  href: string;
  icon?: string;
  iconPlacement?: IconPlacement;
  label?: string;
  size?: Sizes;
}

export const LinkComponent = React.memo(
  ({
    className,
    href,
    icon,
    iconPlacement = IconPlacement.LEFT,
    label,
    size = Sizes.MEDIUM,
  }: LinkComponentProps) => (
    // @TODO add an URL validators
    // it will be created with any backoffice app
    <a
      className={classnames(
        `fr-link fr-link--${size}`,
        {
          [`fr-icon-${icon}`]: !!icon,
          [`fr-link--icon-${iconPlacement}`]: !!icon,
        },
        className,
      )}
      href={href}>
      {label}
    </a>
  ),
);

LinkComponent.displayName = 'LinkComponent';
