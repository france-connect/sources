import React, { useMemo } from 'react';

import type { AccountConfig } from '@fc/account';
import { AccountOptions } from '@fc/account';
import { ConfigService } from '@fc/config';

import { LayoutOptions } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';
import { LayoutHeaderAccountComponent } from './account/layout-header.account';
import { LayoutHeaderToolsLink } from './link/layout-header.tools-link';
import { LayoutHeaderLogoutButton } from './logout/layout-header.logout';

interface LayoutHeaderToolsComponentProps {
  isUserConnected: boolean;
}

export const LayoutHeaderToolsComponent = React.memo(
  ({ isUserConnected }: LayoutHeaderToolsComponentProps) => {
    const { logout, toolsLinks } = useMemo(() => {
      const accountConfig = ConfigService.get<AccountConfig>(AccountOptions.CONFIG_NAME);
      const { header } = ConfigService.get<LayoutConfig>(LayoutOptions.CONFIG_NAME);

      const endpointsLogout = accountConfig.endpoints?.logout;
      const filteredLinks = header?.toolsLinks?.filter(
        ({ onlyIfConnected }) => !onlyIfConnected || isUserConnected,
      );

      return {
        logout: endpointsLogout,
        toolsLinks: filteredLinks,
      };
    }, [isUserConnected]);

    return (
      <ul className="fr-btns-group">
        {toolsLinks?.map(({ dataTestId, external, href, icon, label, title }, index) => {
          const uniqkey = `layout-header-tools-item::${index}`;
          return (
            <LayoutHeaderToolsLink
              key={uniqkey}
              dataTestId={dataTestId}
              external={external}
              href={href}
              icon={icon}
              label={label}
              title={title}
            />
          );
        })}
        {isUserConnected && <LayoutHeaderAccountComponent />}
        {isUserConnected && logout && <LayoutHeaderLogoutButton endSessionUrl={logout} />}
      </ul>
    );
  },
);

LayoutHeaderToolsComponent.displayName = 'LayoutHeaderToolsComponent';
