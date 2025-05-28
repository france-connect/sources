import React from 'react';
import { Link } from 'react-router';

import { getAccessibleTitle } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

import { Options } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';

export const LayoutFooterBrandComponent = React.memo(() => {
  const config = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);
  const { baseline, homepage, logo, name } = config.service;

  const linkTitle = getAccessibleTitle(baseline, name);
  const homepageLinkTitle = getAccessibleTitle('Retour à l’accueil du site', linkTitle);
  return (
    <div className="fr-footer__brand fr-enlarge-link">
      <LogoRepubliqueFrancaiseComponent />
      <Link className="fr-footer__brand-link" title={homepageLinkTitle} to={homepage}>
        <img
          alt={linkTitle}
          className="fr-footer__logo fr-responsive-img"
          src={logo as unknown as string}
          style={{ height: 90, maxHeight: 90 }}
        />
      </Link>
    </div>
  );
});

LayoutFooterBrandComponent.displayName = 'LayoutFooterBrandComponent';
