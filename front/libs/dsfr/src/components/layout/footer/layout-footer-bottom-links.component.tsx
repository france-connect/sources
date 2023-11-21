import React from 'react';

import { NavigationLink } from '../../../interfaces';

export interface LayoutFooterBottomLinksComponentProps {
  items: NavigationLink[];
}

export const LayoutFooterBottomLinksComponent = React.memo(
  ({ items }: LayoutFooterBottomLinksComponentProps) => (
    <ul className="fr-footer__bottom-list">
      {items.map(({ a11y, href, label }, index) => {
        const uniqKey = `layout-footer-bottom-links::${index}`;
        return (
          <li key={uniqKey} className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href={href} title={a11y}>
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  ),
);

LayoutFooterBottomLinksComponent.displayName = 'LayoutFooterBottomLinksComponent';
