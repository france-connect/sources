import React from 'react';

import { t } from '@fc/i18n';

interface AllowFutureIdpSwitchLabelComponentProps {
  checked: boolean;
}

export const AllowFutureIdpSwitchLabelComponent = React.memo(
  ({ checked }: AllowFutureIdpSwitchLabelComponentProps) => {
    const allowedLabel = t('UserPreferences.futureIdps.allowed');
    const disallowedLabel = t('UserPreferences.futureIdps.disallowed');

    const allowFutureIdpStatus = checked ? allowedLabel : disallowedLabel;
    return (
      <span>
        Les futurs moyens de connexion dans FranceConnect
        <strong> seront {allowFutureIdpStatus}</strong>
      </span>
    );
  },
);

AllowFutureIdpSwitchLabelComponent.displayName = 'AllowFutureIdpSwitchLabelComponent';
