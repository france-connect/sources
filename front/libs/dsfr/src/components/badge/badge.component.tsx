import classnames from 'classnames';
import React from 'react';

import { Sizes } from '../../enums';
import type { BadgeInterface } from '../../interfaces';
import styles from './badge.module.scss';

interface BadgeComponentProps extends BadgeInterface {
  size?: Sizes;
  iconSize?: number;
  dataTestId?: string;
  noIcon?: boolean;
}

export const BadgeComponent = React.memo(
  ({
    Icon,
    colorName = 'grey',
    dataTestId,
    iconSize = 18,
    label,
    noIcon = false,
    size = Sizes.MEDIUM,
  }: BadgeComponentProps) => (
    <div
      className={classnames(styles.badge, `fr-badge fr-badge--${colorName} fr-badge--${size}`, {
        // DSFR classname
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-badge--no-icon': !!Icon || noIcon,
      })}
      data-testid={dataTestId}>
      {!noIcon && Icon && <Icon className="fr-mr-1w" size={iconSize} />}
      <b>{label}</b>
    </div>
  ),
);

BadgeComponent.displayName = 'BadgeComponent';
