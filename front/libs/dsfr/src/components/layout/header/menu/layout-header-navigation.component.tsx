import classnames from 'classnames';
import type { MouseEventHandler } from 'react';
import React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

import type { NavigationLink } from '../../../../interfaces';

export interface LayoutHeaderNavigationComponentProps {
  navigationItems?: NavigationLink[];
  className?: string;
  onItemClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const LayoutHeaderNavigationComponent: React.FC<LayoutHeaderNavigationComponentProps> =
  React.memo(
    ({ className, navigationItems, onItemClick }: LayoutHeaderNavigationComponentProps) => {
      const { pathname } = useLocation();

      return (
        <nav
          aria-label="Menu principal"
          className={classnames('fr-nav', className)}
          id="navigation-869"
          role="navigation">
          <ul className="fr-nav__list">
            {navigationItems &&
              navigationItems.map(({ a11y, href: path, label }, index) => {
                const isCurrentPage = matchPath(path, pathname);
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
    },
  );

LayoutHeaderNavigationComponent.defaultProps = {
  className: undefined,
  navigationItems: undefined,
  onItemClick: undefined,
};

LayoutHeaderNavigationComponent.displayName = 'LayoutHeaderNavigationComponent';
