import classnames from 'classnames';
import React from 'react';

import { Sizes } from '../../enums';

export interface LinkComponentProps {
  className?: string;
  href: string;
  icon?: string;
  iconPlacement?: 'right' | 'left';
  label?: string;
  size?: Sizes;
}

export const LinkComponent: React.FC<LinkComponentProps> = React.memo(
  ({ className, href, icon, iconPlacement, label, size }: LinkComponentProps) => (
    // @TODO add an URL validators
    // it will be created with any backoffice app
    <a
      className={classnames(
        `fr-link fr-link--${size}`,
        {
          [`fr-fi-${icon}`]: !!icon,
          [`fr-link--icon-${iconPlacement}`]: !!icon,
        },
        className,
      )}
      href={href}>
      {label}
    </a>
  ),
);

LinkComponent.defaultProps = {
  className: undefined,
  icon: undefined,
  iconPlacement: 'left',
  label: undefined,
  size: Sizes.MEDIUM,
};

LinkComponent.displayName = 'LinkComponent';
