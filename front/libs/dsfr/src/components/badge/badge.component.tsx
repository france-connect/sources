import classnames from 'classnames';
import React from 'react';
import { IconType } from 'react-icons';

import { Sizes } from '../../enums';
import styles from './badge.module.scss';

export interface BadgeComponentProps {
  colorName?: string;
  label: string;
  size?: Sizes;
  icon?: IconType | undefined;
  iconSize?: number;
  dataTestId?: string;
  noIcon?: boolean;
}

export const BadgeComponent: React.FC<BadgeComponentProps> = React.memo(
  ({ colorName, dataTestId, icon: Icon, iconSize, label, noIcon, size }: BadgeComponentProps) => (
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

BadgeComponent.defaultProps = {
  colorName: 'grey',
  dataTestId: undefined,
  icon: undefined,
  iconSize: 18,
  noIcon: false,
  size: Sizes.MEDIUM,
};

BadgeComponent.displayName = 'BadgeComponent';
