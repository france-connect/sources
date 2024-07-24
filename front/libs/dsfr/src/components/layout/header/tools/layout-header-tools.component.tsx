import classnames from 'classnames';
import React from 'react';

import { ConfigService } from '@fc/config';
import type { OidcClientConfig } from '@fc/oidc-client';
import { Options } from '@fc/oidc-client';

import { ReturnButtonComponent } from '../return-button';
import { LayoutHeaderToolsAccountComponent } from './layout-header-tools-account.component';
import { LayoutHeaderToolsLogoutButton } from './layout-header-tools-logout.button';

interface LayoutHeaderToolsComponentProps {
  lastname?: string;
  isModalMenu?: boolean;
  isDesktopViewport?: boolean;
  firstname?: string;
}

export const LayoutHeaderToolsComponent = React.memo(
  ({
    firstname,
    isDesktopViewport = false,
    isModalMenu = false,
    lastname,
  }: LayoutHeaderToolsComponentProps) => {
    const config = ConfigService.get<OidcClientConfig>(Options.CONFIG_NAME);
    const { endSessionUrl, returnButtonUrl } = config.endpoints || {};

    const isConnected = !!(firstname && lastname);

    return (
      <div
        className={classnames({
          // @NOTE unable to create a eslint rule to match this case
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-header__menu-links': isModalMenu,
          // @NOTE unable to create a eslint rule to match this case
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-header__tools-links': !isModalMenu,
        })}>
        <ul className="fr-btns-group">
          {/* @TODO refacto OidcClient */}
          {isDesktopViewport && returnButtonUrl && <ReturnButtonComponent url={returnButtonUrl} />}
          {isConnected && (
            <li>
              <LayoutHeaderToolsAccountComponent
                firstname={firstname}
                isMobile={isModalMenu || false}
                lastname={lastname}
              />
            </li>
          )}
          {isConnected && endSessionUrl && (
            <li>
              <LayoutHeaderToolsLogoutButton
                endSessionUrl={endSessionUrl}
                isMobile={isModalMenu || false}
              />
            </li>
          )}
        </ul>
      </div>
    );
  },
);

LayoutHeaderToolsComponent.displayName = 'LayoutHeaderToolsComponent';
