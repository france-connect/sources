import React from 'react';

import type { AccountConfig } from '@fc/account';
import { AccountOptions } from '@fc/account';
import { ConfigService } from '@fc/config';

import { LayoutHeaderAccountComponent } from '../account/layout-header.account';
import { LayoutHeaderLogoutButton } from '../logout/layout-header.logout';

export const LayoutHeaderToolsComponent = React.memo(() => {
  const config = ConfigService.get<AccountConfig>(AccountOptions.CONFIG_NAME);
  const { logout } = config.endpoints || {};

  return (
    <ul className="fr-btns-group">
      <li>
        <LayoutHeaderAccountComponent />
      </li>
      {logout && (
        <li>
          <LayoutHeaderLogoutButton endSessionUrl={logout} />
        </li>
      )}
    </ul>
  );
});

LayoutHeaderToolsComponent.displayName = 'LayoutHeaderToolsComponent';
