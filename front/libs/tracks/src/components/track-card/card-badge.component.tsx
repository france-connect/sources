import React from 'react';
import {
  RiAccountCircleFill as UserIcon,
  RiArrowLeftRightFill as ArrowsIcon,
  RiCheckboxCircleFill as CheckIcon,
} from 'react-icons/ri';
import './card-badge.scss';

const TYPE_CONFIG = {
  FC_REQUESTED_IDP_USERINFO: {
    backgroundColor: '#66a1e4',
    icon: UserIcon,
    label: 'Connexion',
  },
  SP_REQUESTED_FC_USERINFO: {
    backgroundColor: '#40d496',
    icon: CheckIcon,
    label: 'Autorisation',
  },
  not_relevant_event: {
    backgroundColor: '#f4a381',
    icon: ArrowsIcon,
    label: 'Échange de Données',
  },
} as any;

type TraceCardBadgeProps = {
  type: string;
  fromFcPlus: boolean;
};

const TraceCardBadgeComponent = React.memo(
  ({ fromFcPlus, type }: TraceCardBadgeProps) => {
    const {
      backgroundColor: backgroundcolor,
      icon: Icon,
      label,
    } = TYPE_CONFIG[type];
    return (
      <div className="badge is-absolute fr-text-xs is-white">
        <div className="is-relative flex-columns flex-start items-center is-uppercase">
          <div
            className="py8 px12 mr8"
            // @TODO ajuster quand on aura récupérer l'origine/source des traces
            style={{ backgroundColor: fromFcPlus ? '#1e78f3' : '#000d8f' }}
          >
            <b>FranceConnect</b>
          </div>
          <div
            className="flex-columns items-center py8 px12"
            style={{ backgroundColor: backgroundcolor }}
          >
            <Icon size={18} />
            <b className="ml8">{label}</b>
          </div>
        </div>
      </div>
    );
  },
);

TraceCardBadgeComponent.displayName = 'TraceCardBadgeComponent';

export default TraceCardBadgeComponent;
