import React from 'react';

import type { NavigationLink } from '../../../interfaces';

interface LayoutFooterBottomLinksComponentProps {
  items: NavigationLink[];
}

export const LayoutFooterBottomLinksComponent = React.memo(
  ({ items }: LayoutFooterBottomLinksComponentProps) => (
    <ul className="fr-footer__bottom-list">
      {items.map(({ href, label, title }, index) => {
        const uniqKey = `layout-footer-bottom-links::${index}`;
        return (
          <li key={uniqKey} className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href={href} title={title}>
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  ),
);

LayoutFooterBottomLinksComponent.displayName = 'LayoutFooterBottomLinksComponent';
