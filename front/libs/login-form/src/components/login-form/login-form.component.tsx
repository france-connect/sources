import React from 'react';

import type { AccountConfig } from '@fc/account';
import { Options as AccountOptions } from '@fc/account';
import type { PropsWithClassName } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { ConnectTypes } from '@fc/dsfr';
import { ButtonTypes, LoginConnectButton } from '@fc/dsfr';

interface LoginFormComponentProps extends PropsWithClassName {
  connectType: ConnectTypes;
  redirectUrl?: string;
}

export const LoginFormComponent = React.memo(
  ({ className, connectType, redirectUrl }: LoginFormComponentProps) => {
    const config = ConfigService.get<AccountConfig>(AccountOptions.CONFIG_NAME);
    const { login } = config.endpoints;

    return (
      <form action={login} data-testid="login-form-component" method="get">
        {redirectUrl && <input name="redirectUrl" type="hidden" value={redirectUrl} />}
        <LoginConnectButton
          className={className}
          connectType={connectType}
          data-testid="login-connect-button"
          type={ButtonTypes.SUBMIT}
        />
      </form>
    );
  },
);

LoginFormComponent.displayName = 'LoginFormComponent';
