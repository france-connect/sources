import classnames from 'classnames';
import React, { useCallback, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { UserinfosInterface } from '@fc/oidc-client';
import { AppContext, AppContextInterface } from '@fc/state-management';

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
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    const { state } = useContext<AppContextInterface>(AppContext);
    const userInfos = state.user.userinfos as UserinfosInterface;
    // oidc spec defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const userInfosIsValid = userInfos && userInfos.family_name && userInfos.given_name;

    const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
    // @NOTE pas tester car le test implique de réimplémenter la function
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
              userInfos={userInfos}
              onMobileMenuOpen={mobileMenuToggleHandler}
            />
          </div>
          {gtTablet && userInfosIsValid && navigationItems && (
            <DesktopNavigationComponent navigationLinks={navigationItems} />
          )}
          {!gtTablet && userInfosIsValid && (
            <MobileNavigationComponent
              mobileMenuIsOpen={mobileMenuIsOpen}
              navigationLinks={navigationItems}
              userInfos={userInfos}
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
