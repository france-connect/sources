import React from 'react';

import { ConfigService } from '@fc/config';

import { Options } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';

interface LayoutFooterContentComponentProps {
  showIcon?: boolean;
}

export const LayoutFooterContentComponent = React.memo(
  ({ showIcon = false }: LayoutFooterContentComponentProps) => {
    const config = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);
    const { description, links } = config.footer;

    const target = showIcon ? '_blank' : undefined;
    const rel = showIcon ? 'noreferrer' : undefined;
    return (
      <div className="fr-footer__content">
        {description && <p className="fr-footer__content-desc">{description}</p>}
        {links && (
          <ul className="fr-footer__content-list">
            {links.map(({ href, label, title }, index) => {
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
        )}
      </div>
    );
  },
);

LayoutFooterContentComponent.displayName = 'LayoutFooterContentComponent';
