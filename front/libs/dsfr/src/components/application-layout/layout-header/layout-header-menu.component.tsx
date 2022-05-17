import './layout-header-menu.scss';

import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';
import { RiMenuFill as DrawerIcon } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import { UserInterface } from '@fc/oidc-client';

import { LogoutButtonComponent } from './logout-button';
import { UserWidgetComponent } from './user-widget';

interface LayoutHeaderMenuComponentProps {
  returnButton?: React.FunctionComponent;
  user: UserInterface | undefined;
  onMobileMenuOpen: MouseEventHandler<HTMLButtonElement>;
}

export const LayoutHeaderMenuComponent: React.FC<LayoutHeaderMenuComponentProps> = React.memo(
  ({ onMobileMenuOpen, returnButton: ReturnButton, user }: LayoutHeaderMenuComponentProps) => {
    const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });
    return (
      <div
        className={classnames('LayoutHeaderComponent-menu flex-rows items-end', {
          // Classe CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-2': gtTablet,
          // Classe CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'no-flex': !gtTablet,
        })}>
        {gtTablet && ReturnButton && <ReturnButton />}
        {user && user.connected && (
          <div
            className={classnames(
              'LayoutHeaderComponent-menu-items flex-columns flex-end items-center fs14 lh24 is-blue-france',
              { mt16: gtTablet && !!ReturnButton },
            )}
            data-testid="layout-header-component-menu-items">
            {(gtTablet && (
              <React.Fragment>
                {user.userinfos && <UserWidgetComponent userInfos={user.userinfos} />}
                <LogoutButtonComponent className="ml16" />
              </React.Fragment>
            )) || (
              <button
                className="LayoutHeaderComponent-menu-drawer-btn text-right fs24"
                data-testid="layout-header-component-menu-drawer-btn"
                type="button"
                onClick={onMobileMenuOpen}>
                <DrawerIcon />
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

LayoutHeaderMenuComponent.defaultProps = {
  returnButton: undefined,
};

LayoutHeaderMenuComponent.displayName = 'LayoutHeaderMenuComponent';
