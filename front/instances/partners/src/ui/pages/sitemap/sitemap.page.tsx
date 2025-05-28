import classnames from 'classnames';
import React from 'react';

import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';
import type { LayoutConfig } from '@fc/layout';
import { Options } from '@fc/layout';

import classes from './sitemap.module.scss';

export const SitemapPage = React.memo(() => {
  const { sitemap = [] } = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);

  return (
    <nav className="fr-col-12 fr-col-md-8" id="plan-du-site">
      <h1>Plan du site</h1>
      <ul className="fr-raw-list">
        {sitemap.map((link) => {
          const { external, href, label, title } = link;
          return (
            <li key={label} className={classnames(classes.blueLink, 'fr-mb-2w')}>
              <LinkComponent external={external} href={href} title={title}>
                {label}
              </LinkComponent>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

SitemapPage.displayName = 'SitemapPage';
