import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router';

import { Strings } from '@fc/common';
import { t } from '@fc/i18n';

import { IconPlacement, Sizes } from '../../enums';
import type { LinkInterface } from '../../interfaces';

interface LinkComponentProps extends LinkInterface {
  external?: boolean;
  target?: string;
  rel?: string;
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
    label,
    rel,
    size = Sizes.MEDIUM,
    target,
    title,
  }: LinkComponentProps) => {
    const linkTarget = target || (external ? '_blank' : undefined);
    const isNewWindow = linkTarget === '_blank';

    const linkTitle =
      title && isNewWindow
        ? `${title}${Strings.WHITE_SPACE}${Strings.DASH}${Strings.WHITE_SPACE}${t('FC.Common.newWindow')}`
        : title;

    const linkRel = rel || (external ? 'noopener noreferrer external' : undefined);

    return (
      <Link
        className={classnames(className || `fr-link fr-link--${size}`, {
          [`fr-icon-${icon}`]: !!icon,
          [`fr-link--icon-${iconPlacement}`]: !!icon,
        })}
        data-testid={dataTestId}
        rel={linkRel}
        reloadDocument={external}
        target={linkTarget}
        title={linkTitle}
        to={href}>
        {label || children}
      </Link>
    );
  },
);

LinkComponent.displayName = 'LinkComponent';
