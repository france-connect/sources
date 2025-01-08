import classnames from 'classnames';
import React from 'react';

import type { PropsWithOnClick } from '@fc/common';
import { t } from '@fc/i18n';

import type { ButtonTypes } from '../../../../enums';
import { ConnectTypes } from '../../../../enums';
import styles from './login-connect.button.module.scss';

interface LoginConnectButtonProps extends PropsWithOnClick {
  type: ButtonTypes;
  connectType: ConnectTypes;
}

export const LoginConnectButton = React.memo(
  ({ connectType, onClick, type }: LoginConnectButtonProps) => {
    const loginLabel = t('DSFR.button.loginConnect.authenticateWith');
    return (
      <button
        className={classnames('fr-connect', {
          [styles['fr-connect--proconnect']]: connectType === ConnectTypes.PRO_CONNECT,
        })}
        type={type}
        onClick={onClick}>
        <span className="fr-connect__login">{loginLabel}</span>
        <span className="fr-connect__brand">{connectType}</span>
      </button>
    );
  },
);

LoginConnectButton.displayName = 'LoginConnectButton';
