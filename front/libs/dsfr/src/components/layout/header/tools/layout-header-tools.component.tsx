import classnames from 'classnames';
import React, { useContext } from 'react';

import { AppContext } from '@fc/state-management';

import { ReturnButtonComponent } from '../return-button';
import { LayoutHeaderToolsAccountComponent } from './layout-header-tools-account.component';
import { LayoutHeaderToolsLogoutButton } from './layout-header-tools-logout.button';

interface LayoutHeaderToolsComponentProps {
  lastname?: string;
  isModalMenu?: boolean;
  isDesktopViewport?: boolean;
  firstname?: string;
}

export const LayoutHeaderToolsComponent: React.FC<LayoutHeaderToolsComponentProps> = React.memo(
  ({ firstname, isDesktopViewport, isModalMenu, lastname }: LayoutHeaderToolsComponentProps) => {
    const { state } = useContext(AppContext);
    // @TODO testing implies splitting the function into a private
    // it seems to be useless till should be refactored with the global config for front apps
    // @SEE https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/984
    /* istanbul ignore next */
    const { endSessionUrl, returnButtonUrl } = state.config?.OidcClient?.endpoints || {};

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

LayoutHeaderToolsComponent.defaultProps = {
  firstname: undefined,
  isDesktopViewport: false,
  isModalMenu: false,
  lastname: undefined,
};

LayoutHeaderToolsComponent.displayName = 'LayoutHeaderToolsComponent';
