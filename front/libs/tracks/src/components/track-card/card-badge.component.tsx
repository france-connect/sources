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
    <div className="badge is-absolute fr-text-xs is-white">
      <div className="is-relative flex-columns flex-start items-center is-uppercase">
        <div
          // @TODO ajuster quand on aura récupérer l'origine/source des traces
          className={classnames('py8 px12 mr8', {
            'bg-blue-agentconnect': !fromFcPlus,
            'bg-blue-france': fromFcPlus,
          })}>
          {fromFcPlus && <b>FranceConnect+</b>}
          {!fromFcPlus && <b>FranceConnect</b>}
        </div>
        {badge && (
          <div
            className="flex-columns items-center py8 px12"
            data-testid="badge"
            style={{ backgroundColor: badge.backgroundColor }}>
            <badge.Icon size={18} />
            <b className="ml8">{badge.label}</b>
          </div>
        )}
      </div>
    </div>
  );
});

TrackCardBadgeComponent.displayName = 'TraceCardBadgeComponent';
