import React, { MouseEventHandler } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

import { NavigationLink } from '../../../../interfaces';

interface LayoutHeaderNavigationComponentProps {
  navigationItems?: NavigationLink[];
  onItemClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const LayoutHeaderNavigationComponent: React.FC<LayoutHeaderNavigationComponentProps> =
  React.memo(({ navigationItems, onItemClick }: LayoutHeaderNavigationComponentProps) => {
    const { pathname } = useLocation();
    return (
      <nav aria-label="Menu principal" className="fr-nav" id="navigation-869" role="navigation">
        <ul className="fr-nav__list">
          {navigationItems &&
            navigationItems.map(({ a11y, href: path, label }, index) => {
              const matchOptions = { exact: true, path, strict: false };
              const isCurrentPage = matchPath(pathname, matchOptions);
              const uniqkey = `layout-header-nav-item::${index}`;
              return (
                <li key={uniqkey} className="fr-nav__item">
                  <Link
                    aria-current={isCurrentPage ? 'page' : undefined}
                    className="fr-nav__link"
                    target="_self"
                    title={a11y}
                    to={path}
                    onClick={onItemClick}>
                    {label}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
    );
  });

LayoutHeaderNavigationComponent.defaultProps = {
  navigationItems: undefined,
  onItemClick: undefined,
};

LayoutHeaderNavigationComponent.displayName = 'LayoutHeaderNavigationComponent';
