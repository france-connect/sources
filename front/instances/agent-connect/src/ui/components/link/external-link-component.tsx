import classnames from 'classnames';
import React from 'react';

import { LinkComponentProps, Sizes } from '@fc/dsfr';

export interface ExternalLinkComponentProps extends LinkComponentProps {
  className?: string;
  href: string;
  icon?: string;
  iconPlacement?: 'right' | 'left';
  label?: string;
  size?: Sizes;
  target?: '_blank';
  rel?: string;
}

export const ExternalLinkComponent: React.FC<ExternalLinkComponentProps> = React.memo(
  ({
    className,
    href,
    icon,
    iconPlacement,
    label,
    rel,
    size,
    target,
  }: ExternalLinkComponentProps) => (
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
      href={href}
      rel={rel}
      target={target}>
      {label}
    </a>
  ),
);

ExternalLinkComponent.defaultProps = {
  className: undefined,
  icon: undefined,
  iconPlacement: 'left',
  label: undefined,
  rel: 'noopener noreferrer',
  size: Sizes.MEDIUM,
  target: '_blank',
};

ExternalLinkComponent.displayName = 'ExternalLinkComponent';
