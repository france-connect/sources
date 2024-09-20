import React from 'react';
import { Link } from 'react-router-dom';

import { getAccessibleTitle, useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

import { LayoutContext } from '../../../context';
import { Options } from '../../../enums';
import type { LayoutConfig, LayoutContextState } from '../../../interfaces';
import { LayoutHeaderMobileBurgerButton } from '../burger';
import { LayoutHeaderServiceComponent } from '../service';

export const LayoutHeaderBrandComponent = React.memo(() => {
  const { isUserConnected } = useSafeContext<LayoutContextState>(LayoutContext);

  const config = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);
  const { showServiceTitle } = config.features;
  const { baseline, homepage, logo, name } = config.service;

  const linkTitle = getAccessibleTitle(baseline, name);
  const homepageLinkTitle = getAccessibleTitle('Retour à l’accueil du site', linkTitle);
  return (
    <div className="fr-header__brand fr-enlarge-link">
      <div className="fr-header__brand-top">
        <div className="fr-header__logo">
          <Link title={homepageLinkTitle} to={homepage}>
            <LogoRepubliqueFrancaiseComponent />
          </Link>
        </div>
        <div className="fr-header__operator">
          <img alt={linkTitle} className="fr-responsive-img" src={logo as unknown as string} />
        </div>
        {isUserConnected && <LayoutHeaderMobileBurgerButton />}
      </div>
      {showServiceTitle && <LayoutHeaderServiceComponent />}
    </div>
  );
});

LayoutHeaderBrandComponent.displayName = 'LayoutHeaderBrandComponent';
