import classnames from 'classnames';
import React from 'react';

import type { PropsWithClassName, PropsWithOnClick } from '@fc/common';

import type { ConnectTypes } from '../../../enums';
import { ButtonTypes } from '../../../enums';
import { LoginConnectButton } from './button';
import { LoginConnectHelp } from './help';

interface LoginConnectComponentProps extends PropsWithClassName, PropsWithOnClick {
  showIcon?: boolean;
  showHelp?: boolean;
  type?: ButtonTypes;
  connectType: ConnectTypes;
}

export const LoginConnectComponent = React.memo(
  ({
    className,
    connectType,
    onClick,
    showHelp = false,
    showIcon = false,
    type = ButtonTypes.BUTTON,
  }: LoginConnectComponentProps) => (
    <div className={classnames('fr-connect-group', className)} data-testid="LoginConnectComponent">
      <LoginConnectButton connectType={connectType} type={type} onClick={onClick} />
      {showHelp && <LoginConnectHelp connectType={connectType} showIcon={showIcon} />}
    </div>
  ),
);

LoginConnectComponent.displayName = 'LoginConnectComponent';
