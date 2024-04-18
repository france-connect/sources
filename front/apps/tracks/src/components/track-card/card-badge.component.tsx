import classnames from 'classnames';
import React from 'react';
import {
  RiAccountCircleFill as UserIcon,
  RiArrowLeftRightFill as ArrowsIcon,
  RiCheckboxCircleFill as CheckIcon,
} from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import { CinematicEvents } from '../../enums';
import type { Badges } from '../../interfaces';
import styles from './card-badge.module.scss';

const TYPE_CONFIG = {
  [CinematicEvents.DP_VERIFIED_FC_CHECKTOKEN]: {
    Icon: ArrowsIcon,
    colorName: 'pink-macaron',
    label: 'Échange de Données',
  },
  [CinematicEvents.FC_DATATRANSFER_CONSENT_IDENTITY]: {
    Icon: CheckIcon,
    colorName: 'green-emeraude',
    label: 'Autorisation',
  },
  [CinematicEvents.FC_VERIFIED]: {
    Icon: UserIcon,
    colorName: 'green-archipel',
    label: 'Connexion',
  },
} as Badges;

type TraceCardBadgeProps = {
  type: string | undefined;
  fromFcPlus: boolean;
};

export const TrackCardBadgeComponent = React.memo(({ fromFcPlus, type }: TraceCardBadgeProps) => {
  const gtMobile = useMediaQuery({ minWidth: 576 });
  const badge = !type ? null : TYPE_CONFIG[type.toUpperCase()];
  return (
    <div className={classnames('is-absolute', styles.container)}>
      <div className="fr-badge-group">
        <div
          className={classnames('fr-badge is-white', {
            [styles.badgeFranceConnect]: !fromFcPlus,
            [styles.badgeFranceConnectPlus]: fromFcPlus,
            // class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-badge--md': gtMobile,
            // class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-badge--sm': !gtMobile,
          })}
          data-testid="TrackCardBadgeComponent-platform-badge">
          {fromFcPlus ? 'FranceConnect+' : 'FranceConnect'}
        </div>
        {badge && (
          <div
            className={classnames(`fr-badge fr-badge--${badge.colorName}`, {
              // class CSS
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-badge--md': gtMobile,
              // class CSS
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-badge--sm': !gtMobile,
            })}
            data-testid="TrackCardBadgeComponent-action-badge">
            <badge.Icon size={18} />
            <b className="fr-ml-1w">{badge.label}</b>
          </div>
        )}
      </div>
    </div>
  );
});

TrackCardBadgeComponent.displayName = 'TraceCardBadgeComponent';
