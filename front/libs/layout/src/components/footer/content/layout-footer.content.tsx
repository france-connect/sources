import React from 'react';

import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';

import { LayoutOptions } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';

export const LayoutFooterContentComponent = React.memo(() => {
  const config = ConfigService.get<LayoutConfig>(LayoutOptions.CONFIG_NAME);
  const { description, links } = config.footer;

  return (
    <div className="fr-footer__content">
      {description && <p className="fr-footer__content-desc">{description}</p>}
      {links && (
        <ul className="fr-footer__content-list">
          {links.map(({ external, href, label, title }, index) => {
            const uniqKey = `layout-footer-content-links::${index}`;
            return (
              <li key={uniqKey} className="fr-footer__content-item">
                <LinkComponent
                  className="fr-footer__content-link"
                  external={external}
                  href={href}
                  title={title}>
                  {label}
                </LinkComponent>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

LayoutFooterContentComponent.displayName = 'LayoutFooterContentComponent';
