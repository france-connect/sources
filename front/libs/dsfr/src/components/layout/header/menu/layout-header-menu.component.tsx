import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';

import { NavigationLink } from '../../../../interfaces';
import { LayoutHeaderToolsComponent } from '../tools';
import { LayoutHeaderNavigationComponent } from './layout-header-navigation.component';

export interface LayoutHeaderMenuComponentProps {
  opened: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  navigationItems?: NavigationLink[];
  lastname: string | undefined;
  firstname: string | undefined;
}

export const LayoutHeaderMenuComponent: React.FC<LayoutHeaderMenuComponentProps> = React.memo(
  ({ firstname, lastname, navigationItems, onClose, opened }: LayoutHeaderMenuComponentProps) => (
    <div
      aria-labelledby="burger-button-mobile-menu"
      className={classnames('fr-header__menu fr-modal', {
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
          <LayoutHeaderNavigationComponent navigationItems={navigationItems} />
        )}
      </div>
    </div>
  ),
);

LayoutHeaderMenuComponent.defaultProps = {
  navigationItems: undefined,
};

LayoutHeaderMenuComponent.displayName = 'LayoutHeaderMenuComponent';
