import React from 'react';

interface ServiceSwitchLabelComponentProps {
  checked: boolean;
  serviceTitle: string;
}

export const ServiceSwitchLabelComponent = React.memo(
  ({ checked, serviceTitle }: ServiceSwitchLabelComponentProps) => {
    const state = checked ? 'autorisée' : 'bloquée';
    return (
      <span>
        La connexion pour votre compte <b>{serviceTitle}</b> est actuellement {state}.
      </span>
    );
  },
);

ServiceSwitchLabelComponent.displayName = 'ServiceSwitchLabelComponent';
