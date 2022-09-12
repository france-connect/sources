import React from 'react';

interface AllowFutureIdpSwitchLabelComponentProps {
  checked: boolean;
}

export const AllowFutureIdpSwitchLabelComponent = React.memo(
  ({ checked }: AllowFutureIdpSwitchLabelComponentProps) => {
    const allowFutureIdpStatus = checked ? 'autorisés' : 'bloqués';
    return (
      <span>
        Les futurs moyens de connexion dans FranceConnect
        <strong> seront {allowFutureIdpStatus}</strong>
      </span>
    );
  },
);

AllowFutureIdpSwitchLabelComponent.displayName = 'AllowFutureIdpSwitchLabelComponent';
