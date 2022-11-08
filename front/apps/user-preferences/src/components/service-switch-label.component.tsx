import React from 'react';

interface ServiceSwitchLabelComponentProps {
  checked: boolean;
  disabled?: boolean;
  serviceTitle: string;
}

export const ServiceSwitchLabelComponent: React.FC<ServiceSwitchLabelComponentProps> = React.memo(
  ({ checked, disabled, serviceTitle }: ServiceSwitchLabelComponentProps) => {
    const state = checked ? 'autorisée' : 'bloquée';
    return (
      (!disabled && (
        <span>
          La connexion pour votre compte <b>{serviceTitle}</b> est actuellement {state}.
        </span>
      )) || (
        <span>
          <b>Vous êtes connecté depuis ce compte.</b>
          <br />
          <span>
            Si vous souhaitez le désactiver, vous devez vous connecter depuis un autre compte.
          </span>
        </span>
      )
    );
  },
);

ServiceSwitchLabelComponent.defaultProps = {
  disabled: false,
};

ServiceSwitchLabelComponent.displayName = 'ServiceSwitchLabelComponent';
