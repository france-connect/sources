import classnames from 'classnames';
import React from 'react';
import type { IconType } from 'react-icons';

import { Sizes } from '../../enums';
import styles from './badge.module.scss';

interface BadgeComponentProps {
  colorName?: string;
  label: string;
  size?: Sizes;
  icon?: IconType | undefined;
  iconSize?: number;
  dataTestId?: string;
  noIcon?: boolean;
}

export const BadgeComponent = React.memo(
  ({
    colorName = 'grey',
    dataTestId,
    icon: Icon,
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
