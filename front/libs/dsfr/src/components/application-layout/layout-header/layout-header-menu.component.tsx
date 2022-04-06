import './layout-header-menu.scss';

import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';
import { RiMenuFill as DrawerIcon } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import { UserinfosInterface } from '@fc/oidc-client';

import { LogoutButtonComponent } from './logout-button';
import { UserWidgetComponent } from './user-widget';

interface LayoutHeaderMenuComponentProps {
  returnButton?: React.FunctionComponent;
  userInfos: UserinfosInterface;
  onMobileMenuOpen: MouseEventHandler<HTMLButtonElement>;
}

export const LayoutHeaderMenuComponent: React.FC<LayoutHeaderMenuComponentProps> = React.memo(
  ({ onMobileMenuOpen, returnButton: ReturnButton, userInfos }: LayoutHeaderMenuComponentProps) => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
    const userInfosIsValid = userInfos && userInfos.family_name && userInfos.given_name;
    return (
      <div
        className={classnames('LayoutHeaderComponent-menu flex-rows items-end', {
          'flex-2': gtTablet,
          'no-flex': !gtTablet,
        })}>
        {gtTablet && ReturnButton && <ReturnButton />}
        {userInfosIsValid && (
          <div
            className={classnames(
              'LayoutHeaderComponent-menu-items flex-columns flex-end items-center fs14 lh24 is-blue-france',
              { mt16: gtTablet && !!ReturnButton },
            )}
            data-testid="layout-header-component-menu-items">
            {(gtTablet && (
              <React.Fragment>
                <UserWidgetComponent userInfos={userInfos} />
                <LogoutButtonComponent className="ml16" />
              </React.Fragment>
            )) || (
              <button className="text-right" type="button" onClick={onMobileMenuOpen}>
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
