import classnames from 'classnames';
import React from 'react';

import { ButtonTypes, ConnectTypes } from '../../../enums';

interface LoginConnectButtonProps
  extends Pick<React.HTMLProps<HTMLButtonElement>, 'onClick' | 'className'> {
  showIcon?: boolean;
  showHelp?: boolean;
  type?: ButtonTypes;
  connectType: ConnectTypes;
}

export const LoginConnectButton = React.memo(
  ({
    className,
    connectType,
    onClick,
    showHelp = false,
    showIcon = false,
    type = ButtonTypes.BUTTON,
  }: LoginConnectButtonProps) => {
    const target = showIcon ? '_blank' : undefined;
    const rel = showIcon ? 'noreferrer' : undefined;
    const url =
      connectType === ConnectTypes.FRANCE_CONNECT
        ? 'https://franceconnect.gouv.fr/'
        : 'https://agentconnect.gouv.fr/';
    const label = `Qu’est ce que ${connectType} ?`;
    return (
      <div className={classnames('fr-connect-group', className)} data-testid="LoginConnectButton">
        <button className="fr-connect" type={type} onClick={onClick}>
          <span className="fr-connect__login">S’identifier avec</span>
          <span className="fr-connect__brand">{connectType}</span>
        </button>
        {showHelp && (
          <p>
            <a href={url} rel={rel} target={target} title={`${label} - nouvelle fenêtre`}>
              {label}
            </a>
          </p>
        )}
      </div>
    );
  },
);

LoginConnectButton.displayName = 'LoginConnectButton';
