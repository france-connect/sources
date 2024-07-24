import React from 'react';

import type { NavigationLink } from '../../../interfaces';

interface LayoutFooterContentLinksComponentProps {
  items: NavigationLink[];
  showIcon?: boolean;
}

export const LayoutFooterContentLinksComponent = React.memo(
  ({ items, showIcon = false }: LayoutFooterContentLinksComponentProps) => {
    const target = showIcon ? '_blank' : undefined;
    const rel = showIcon ? 'noreferrer' : undefined;
    return (
      <ul className="fr-footer__content-list">
        {items.map(({ href, label, title }, index) => {
          const uniqKey = `layout-footer-content-links::${index}`;
          return (
            <li key={uniqKey} className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href={href}
                rel={rel}
                target={target}
                title={title}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  },
);

LayoutFooterContentLinksComponent.displayName = 'LayoutFooterContentLinksComponent';
