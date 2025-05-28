import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { Link } from 'react-router';

import type { PropsWithClassName } from '@fc/common';

import { IconPlacement, Sizes } from '../../enums';

interface LinkComponentProps extends PropsWithChildren, PropsWithClassName {
  href: string;
  icon?: string;
  iconPlacement?: IconPlacement;
  size?: Sizes;
  label?: string | undefined;
  external?: boolean;
  target?: string;
  title?: string;
  rel?: string;
  dataTestId?: string;
}

export const LinkComponent = React.memo(
  ({
    children,
    className,
    dataTestId,
    external = false,
    href,
    icon,
    iconPlacement = IconPlacement.LEFT,
    label = undefined,
    rel,
    size = Sizes.MEDIUM,
    target,
    title = undefined,
  }: LinkComponentProps) => (
    <Link
      className={classnames(
        `fr-link fr-link--${size}`,
        {
          [`fr-icon-${icon}`]: !!icon,
          [`fr-link--icon-${iconPlacement}`]: !!icon,
        },
        className,
      )}
      data-testid={dataTestId}
      rel={rel || (external ? 'noopener noreferrer external' : undefined)}
      reloadDocument={external}
      target={target || (external ? '_blank' : undefined)}
      title={title}
      to={href}>
      {label || children}
    </Link>
  ),
);

LinkComponent.displayName = 'LinkComponent';
