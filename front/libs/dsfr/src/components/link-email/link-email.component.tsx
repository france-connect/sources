import classnames from 'classnames';
import React from 'react';

import { t } from '@fc/i18n';

import { IconPlacement, Sizes } from '../../enums';
import type { LinkInterface } from '../../interfaces';

interface LinkEmailComponentProps extends Omit<LinkInterface, 'href'> {
  email: string;
}

export const LinkEmailComponent = React.memo(
  ({
    children = undefined,
    className,
    dataTestId,
    email,
    icon,
    iconPlacement = IconPlacement.LEFT,
    label = undefined,
    size = Sizes.MEDIUM,
    title = undefined,
  }: LinkEmailComponentProps) => (
    <a
      aria-label={t('DSFR.link.sendEmailTo', { email })}
      className={classnames(
        `fr-link fr-link--${size}`,
        {
          [`fr-icon-${icon}`]: !!icon,
          [`fr-link--icon-${iconPlacement}`]: !!icon,
        },
        className,
      )}
      data-testid={dataTestId}
      href={`mailto:${email}`}
      title={title}>
      {label || children || email}
    </a>
  ),
);

LinkEmailComponent.displayName = 'LinkEmailComponent';
