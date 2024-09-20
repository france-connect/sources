import React from 'react';

import { ConfigService } from '@fc/config';

import { Options } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';

export const LayoutFooterBottomComponent = React.memo(() => {
  const config = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);
  const { navigation } = config.footer;
  const { showLicence } = config.features;

  return (
    <div className="fr-footer__bottom" data-testid="sticky-footer-fr-footer__bottom">
      {navigation && (
        <ul className="fr-footer__bottom-list">
          {navigation.map(({ href, label, title }, index) => {
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
      )}
      {showLicence && (
        <div className="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les contenus de ce site sont sous{' '}
            <a
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              rel="noreferrer"
              target="_blank">
              licence etalab-2.0
            </a>
          </p>
        </div>
      )}
    </div>
  );
});

LayoutFooterBottomComponent.displayName = 'LayoutFooterBottomComponent';
