import classnames from 'classnames';
import type { MouseEventHandler } from 'react';
import React from 'react';

import type { NavigationLink } from '../../../../interfaces';
import { LayoutHeaderToolsComponent } from '../tools';
import styles from './layout-header-menu.module.scss';
import { LayoutHeaderNavigationComponent } from './layout-header-navigation.component';

interface LayoutHeaderMenuComponentProps {
  opened: boolean;
  isMobile: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  navigationItems?: NavigationLink[];
  lastname: string | undefined;
  firstname: string | undefined;
}

export const LayoutHeaderMenuComponent = React.memo(
  ({
    firstname,
    isMobile,
    lastname,
    navigationItems,
    onClose,
    opened,
  }: LayoutHeaderMenuComponentProps) => (
    <div
      aria-labelledby="burger-button-mobile-menu"
      className={classnames('fr-header__menu fr-modal', styles.menu, {
        // @NOTE unable to create a eslint rule to match this case
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-modal--opened': opened,
      })}
      id="layout-header-menu-modal">
      <div className="fr-container">
        <button
          aria-controls="layout-header-menu-modal"
          className="fr-btn--close fr-btn"
          onClick={onClose}>
          Fermer
        </button>
        <LayoutHeaderToolsComponent isModalMenu firstname={firstname} lastname={lastname} />
        {navigationItems?.length && (
          <LayoutHeaderNavigationComponent
            className={isMobile ? styles.nav : undefined}
            navigationItems={navigationItems}
            onItemClick={onClose}
          />
        )}
      </div>
    </div>
  ),
);

LayoutHeaderMenuComponent.displayName = 'LayoutHeaderMenuComponent';
