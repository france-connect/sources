import type { MouseEventHandler } from 'react';
import React from 'react';
import { NavLink } from 'react-router-dom';

import type { NavigationLinkInterface } from '@fc/common';

interface LayoutHeaderNavigationComponentProps {
  navigation?: NavigationLinkInterface[];
  onItemClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const LayoutHeaderNavigationComponent = React.memo(
  ({ navigation, onItemClick }: LayoutHeaderNavigationComponentProps) => (
    <nav aria-label="Menu principal" className="fr-nav" role="navigation">
      <ul className="fr-nav__list">
        {navigation &&
          navigation.map(({ href: path, label, title }, index) => {
            const uniqkey = `layout-header-nav-item::${index}`;
            return (
              <li key={uniqkey} className="fr-nav__item">
                <NavLink
                  className="fr-nav__link"
                  target="_self"
                  title={title}
                  to={path}
                  onClick={onItemClick}>
                  {label}
                </NavLink>
              </li>
            );
          })}
      </ul>
    </nav>
  ),
);

LayoutHeaderNavigationComponent.displayName = 'LayoutHeaderNavigationComponent';
