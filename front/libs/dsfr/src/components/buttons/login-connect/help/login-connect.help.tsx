import React from 'react';

import { Strings } from '@fc/common';
import { t } from '@fc/i18n';

import { ConnectTypes } from '../../../../enums';

interface LoginConnectHelpProps {
  showIcon?: boolean;
  connectType: ConnectTypes;
}

export const LoginConnectHelp = React.memo(
  ({ connectType, showIcon = false }: LoginConnectHelpProps) => {
    const target = showIcon ? '_blank' : undefined;
    const rel = showIcon ? 'noreferrer' : undefined;

    const url =
      connectType === ConnectTypes.FRANCE_CONNECT
        ? 'https://franceconnect.gouv.fr/'
        : 'https://proconnect.gouv.fr/';

    const titleSuffix = showIcon
      ? `${Strings.WHITE_SPACE}${Strings.DASH}${Strings.WHITE_SPACE}${t('FC.Common.newWindow')}`
      : Strings.EMPTY_STRING;

    const helpLabel = t('DSFR.button.loginConnect.whatIs', { connectType });

    return (
      <p>
        <a href={url} rel={rel} target={target} title={`${helpLabel}${titleSuffix}`}>
          {helpLabel}
        </a>
      </p>
    );
  },
);

LoginConnectHelp.displayName = 'LoginConnectHelp';
