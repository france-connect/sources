import classnames from 'classnames';
import React, { useCallback, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { AccountContext, AccountInterface } from '@fc/account';
import { AppContext, AppContextInterface } from '@fc/state-management';

import styles from './layout-header.module.scss';
import { LayoutHeaderLogosComponent } from './logos';
import { LayoutHeaderMenuComponent } from './menu';
import { LayoutHeaderMobileBurgerButton } from './mobile-burger-button';
import { ReturnButtonComponent } from './return-button';
import { LayoutHeaderServiceComponent } from './service/layout-header-service.component';
import { LayoutHeaderToolsComponent } from './tools';

export const LayoutHeaderComponent = React.memo(() => {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const ltDesktop = useMediaQuery({ query: '(max-width: 992px)' });

  const { connected, ready, userinfos } = useContext<AccountInterface>(AccountContext);

  const isUserConnected = connected && ready;
  const firstname = userinfos?.firstname;
  const lastname = userinfos?.lastname;

  const { state } = useContext<AppContextInterface>(AppContext);
  const { footerLinkTitle, logo, navigationItems, service } = state.config.Layout;
  // @TODO testing implies splitting the function into a private
  // it seems to be useless till should be refactored with the global config for front apps
  // @SEE https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/984
  /* istanbul ignore next */
  const { returnButtonUrl } = state.config?.OidcClient?.endpoints || {};

  /* @NOTE can not be mocked without a native re-implementation */
  /* istanbul ignore next */
  const toggleMobileMenu = useCallback(() => {
    /* @NOTE can not be mocked without a native re-implementation */
    /* istanbul ignore next */
    setMobileMenuOpened((prev: boolean) => !prev);
  }, []);

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
                      onOpen={toggleMobileMenu}
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
            onClose={toggleMobileMenu}
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
