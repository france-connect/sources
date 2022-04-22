import classnames from 'classnames';
import React, { useCallback, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { UserInfosContext, UserInterface } from '@fc/oidc-client';

import { NavigationLink } from '../props.interface';
import { LayoutHeaderLogosComponent } from './layout-header-logos.component';
import { LayoutHeaderMenuComponent } from './layout-header-menu.component';
import { DesktopNavigationComponent } from './navigation-desktop';
import { MobileNavigationComponent } from './navigation-mobile';

interface LayoutHeaderProps {
  logo: React.FunctionComponent;
  title: string;
  navigationItems?: NavigationLink[];
  returnButton?: React.FunctionComponent;
}

export const LayoutHeaderComponent: React.FC<LayoutHeaderProps> = React.memo(
  ({ logo, navigationItems, returnButton: ReturnButton, title }: LayoutHeaderProps) => {
    const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });
    const user = useContext<UserInterface>(UserInfosContext);

    const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
    // @NOTE can not be tested
    // it implies to implement react native hooks, useCallback/useState
    /* istanbul ignore next */
    const mobileMenuToggleHandler = useCallback(() => {
      /* istanbul ignore next */
      setMobileMenuIsOpen((prev) => !prev);
    }, []);

    return (
      <React.Fragment>
        <header
          className={classnames('LayoutHeaderComponent shadow-bottom', {
            mb40: !gtTablet && !ReturnButton,
            mb80: gtTablet,
          })}
          role="banner">
          <div
            className={classnames('flex-columns flex-between content-wrapper-lg px16 py12', {
              'items-center': gtTablet,
              'items-start': !gtTablet,
            })}
            data-testid="banner-content">
            <LayoutHeaderLogosComponent logo={logo} title={title} />
            <LayoutHeaderMenuComponent
              returnButton={ReturnButton}
              user={user}
              onMobileMenuOpen={mobileMenuToggleHandler}
            />
          </div>
          {gtTablet && user && user.connected && navigationItems && (
            <DesktopNavigationComponent navigationLinks={navigationItems} />
          )}
          {!gtTablet && user && user.connected && (
            <MobileNavigationComponent
              mobileMenuIsOpen={mobileMenuIsOpen}
              navigationLinks={navigationItems}
              userInfos={user.userinfos}
              onClose={mobileMenuToggleHandler}
            />
          )}
        </header>
        {!gtTablet && ReturnButton && <ReturnButton />}
      </React.Fragment>
    );
  },
);

LayoutHeaderComponent.defaultProps = {
  navigationItems: undefined,
  returnButton: undefined,
};

LayoutHeaderComponent.displayName = 'LayoutHeaderComponent';
