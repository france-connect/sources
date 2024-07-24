import classnames from 'classnames';
import React, { useContext } from 'react';
import { useToggle } from 'usehooks-ts';

import type { AccountInterface } from '@fc/account';
import { AccountContext } from '@fc/account';
import { ConfigService } from '@fc/config';
import type { LayoutConfig } from '@fc/dsfr';
import { Options as LayoutOptions } from '@fc/dsfr';
import type { OidcClientConfig } from '@fc/oidc-client';
import { Options as OidcClientOptions } from '@fc/oidc-client';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import styles from './layout-header.module.scss';
import { LayoutHeaderLogosComponent } from './logos';
import { LayoutHeaderMenuComponent } from './menu';
import { LayoutHeaderMobileBurgerButton } from './mobile-burger-button';
import { ReturnButtonComponent } from './return-button';
import { LayoutHeaderServiceComponent } from './service/layout-header-service.component';
import { LayoutHeaderToolsComponent } from './tools';

export const LayoutHeaderComponent = React.memo(() => {
  const [mobileMenuOpened, toggleMobileMenuOpened] = useToggle(false);

  const layoutConfig = ConfigService.get<LayoutConfig>(LayoutOptions.CONFIG_NAME);
  const { footerLinkTitle, logo, navigationItems, service } = layoutConfig;

  const oidcClientConfig = ConfigService.get<OidcClientConfig>(OidcClientOptions.CONFIG_NAME);
  const { returnButtonUrl } = oidcClientConfig.endpoints;

  // @TODO add a Hook to get informations
  // instead of using useContext
  // -> easier to mock and test
  const { connected, ready, userinfos } = useContext<AccountInterface>(AccountContext);
  const isUserConnected = connected && ready;
  const firstname = userinfos?.firstname;
  const lastname = userinfos?.lastname;

  const [breakpointLg] = useStylesVariables('breakpoint-lg');

  const ltDesktop = useStylesQuery({ maxWidth: breakpointLg });

  return (
    <React.Fragment>
      <header className={classnames(styles.banner, 'fr-header')} role="banner">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <LayoutHeaderLogosComponent logo={logo} title={footerLinkTitle} />
                  {isUserConnected && (
                    // @NOTE Mobile buger button
                    // used to show/hide Mobile modal menu
                    <LayoutHeaderMobileBurgerButton
                      opened={mobileMenuOpened}
                      onOpen={() => {
                        toggleMobileMenuOpened();
                      }}
                    />
                  )}
                </div>
                {service && <LayoutHeaderServiceComponent service={service} />}
              </div>
              <div className="fr-header__tools">
                {/* @NOTE Used to show
                  - user's givenname/familyname
                  - the return button (desktop only) */}
                <LayoutHeaderToolsComponent
                  firstname={firstname}
                  isDesktopViewport={!ltDesktop}
                  isModalMenu={false}
                  lastname={lastname}
                />
              </div>
            </div>
          </div>
        </div>
        {isUserConnected && (
          // @NOTE Used to show
          // - Mobile modal menu
          // - Desktop pages navigation bar (inline menu)
          <LayoutHeaderMenuComponent
            firstname={firstname}
            isMobile={ltDesktop}
            lastname={lastname}
            navigationItems={navigationItems}
            opened={mobileMenuOpened}
            onClose={() => {
              toggleMobileMenuOpened();
            }}
          />
        )}
      </header>
      {/* @TODO refacto OidcClient */}
      {ltDesktop && returnButtonUrl && (
        <ReturnButtonComponent isMobileViewport url={returnButtonUrl} />
      )}
    </React.Fragment>
  );
});

LayoutHeaderComponent.displayName = 'LayoutHeaderComponent';
