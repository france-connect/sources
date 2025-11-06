import React from 'react';

import { MessageTypes } from '@fc/common';
import { AlertComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const SessionExpiredAlertComponent = React.memo(() => (
  <AlertComponent
    className="text-left fr-my-3w"
    dataTestId="AlertComponent-session-expired-alert"
    size={Sizes.SMALL}
    type={MessageTypes.WARNING}>
    <p>{t('FC.session.expired')}</p>
  </AlertComponent>
));

SessionExpiredAlertComponent.displayName = 'SessionExpiredAlertComponent';
