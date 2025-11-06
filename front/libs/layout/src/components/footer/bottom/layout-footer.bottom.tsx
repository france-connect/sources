import React from 'react';

import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';

import { LayoutOptions } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';

export const LayoutFooterBottomComponent = React.memo(() => {
  const config = ConfigService.get<LayoutConfig>(LayoutOptions.CONFIG_NAME);
  const { navigation } = config.footer;
  const { showLicence } = config.features;

  return (
    <div className="fr-footer__bottom" data-testid="sticky-footer-fr-footer__bottom">
      {navigation && (
        <ul className="fr-footer__bottom-list">
          {navigation.map(({ external, href, label, title }, index) => {
            const uniqKey = `layout-footer-bottom-links::${index}`;
            return (
              <li key={uniqKey} className="fr-footer__bottom-item">
                <LinkComponent
                  className="fr-footer__bottom-link"
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
      {showLicence && (
        <div className="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les contenus de ce site sont sous{' '}
            <LinkComponent
              external
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md">
              licence etalab-2.0
            </LinkComponent>
          </p>
        </div>
      )}
    </div>
  );
});

LayoutFooterBottomComponent.displayName = 'LayoutFooterBottomComponent';
