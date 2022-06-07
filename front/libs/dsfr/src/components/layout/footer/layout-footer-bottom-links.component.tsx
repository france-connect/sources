import React from 'react';
import { Link } from 'react-router-dom';

import { NavigationLink } from '../../../interfaces';

interface LayoutFooterBottomLinksComponentProps {
  items: NavigationLink[];
}

export const LayoutFooterBottomLinksComponent = React.memo(
  ({ items }: LayoutFooterBottomLinksComponentProps) => (
    <ul className="fr-footer__bottom-list">
      {items.map(({ a11y, href, label }, index) => {
        const uniqKey = `layout-footer-bottom-links::${index}`;
        return (
          <li key={uniqKey} className="fr-footer__bottom-item">
            <Link className="fr-footer__bottom-link" title={a11y} to={href}>
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  ),
);

LayoutFooterBottomLinksComponent.displayName = 'LayoutFooterBottomLinksComponent';
