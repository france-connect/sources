import React from 'react';

import { NavigationLink } from '../../../interfaces';

interface LayoutFooterContentLinksComponentProps {
  items: NavigationLink[];
  showIcon?: boolean;
}

export const LayoutFooterContentLinksComponent: React.FC<LayoutFooterContentLinksComponentProps> =
  React.memo(({ items, showIcon }: LayoutFooterContentLinksComponentProps) => {
    const target = showIcon ? '_blank' : undefined;
    const rel = showIcon ? 'noreferrer' : undefined;
    return (
      <ul className="fr-footer__content-list">
        {items.map(({ a11y, href, label }, index) => {
          const uniqKey = `layout-footer-content-links::${index}`;
          return (
            <li key={uniqKey} className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href={href}
                rel={rel}
                target={target}
                title={a11y}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  });

LayoutFooterContentLinksComponent.defaultProps = {
  showIcon: false,
};

LayoutFooterContentLinksComponent.displayName = 'LayoutFooterContentLinksComponent';
