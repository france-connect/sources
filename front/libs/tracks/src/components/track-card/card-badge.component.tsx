import './card-badge.scss';

import classnames from 'classnames';
import React from 'react';
import {
  RiAccountCircleFill as UserIcon,
  RiArrowLeftRightFill as ArrowsIcon,
  RiCheckboxCircleFill as CheckIcon,
} from 'react-icons/ri';

import { Badges } from '../../interfaces';

const TYPE_CONFIG = {
  DP_REQUESTED_FC_CHECKTOKEN: {
    Icon: ArrowsIcon,
    backgroundColor: '#f4a381',
    label: 'Échange de Données',
  },
  FC_DATATRANSFER_CONSENT_DATA: {
    Icon: CheckIcon,
    backgroundColor: '#40d496',
    label: 'Autorisation',
  },
  FC_DATATRANSFER_CONSENT_IDENTITY: {
    Icon: CheckIcon,
    backgroundColor: '#40d496',
    label: 'Autorisation',
  },
  FC_VERIFIED: {
    Icon: UserIcon,
    backgroundColor: '#66a1e4',
    label: 'Connexion',
  },
} as Badges;

type TraceCardBadgeProps = {
  type: string | undefined;
  fromFcPlus: boolean;
};

export const TrackCardBadgeComponent = React.memo(({ fromFcPlus, type }: TraceCardBadgeProps) => {
  const badge = !type ? null : TYPE_CONFIG[type.toUpperCase()];

  return (
    <div className="badge is-absolute fr-text--xs is-white">
      <div className="is-relative flex-columns flex-start items-center is-uppercase">
        <div
          // @TODO ajuster quand on aura récupérer l'origine/source des traces
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          className={classnames('fr-py-1w fr-px-3v fr-mr-1w', {
            // class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-badge--blue-france-connect': !fromFcPlus,
            // class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-badge--blue-france-connect-plus': fromFcPlus,
          })}>
          {fromFcPlus && <b>FranceConnect+</b>}
          {!fromFcPlus && <b>FranceConnect</b>}
        </div>
        {badge && (
          <div
            className="flex-columns items-center fr-py-1w fr-px-3v"
            data-testid="badge"
            style={{ backgroundColor: badge.backgroundColor }}>
            <badge.Icon size={18} />
            <b className="fr-ml-1w">{badge.label}</b>
          </div>
        )}
      </div>
    </div>
  );
});

TrackCardBadgeComponent.displayName = 'TraceCardBadgeComponent';
