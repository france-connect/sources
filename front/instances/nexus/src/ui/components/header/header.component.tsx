import React from 'react';
import { Link } from 'react-router';

import { LogoFranceConnect10Ans } from '@fc/assets';
import { getAccessibleTitle } from '@fc/common';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

const SERVICE_NAME = 'Nexus';
const BACK_TO_HOMEPAGE = 'Retour à l’accueil du site';

// @TODO temporary until the login system is in place
export const HeaderComponent = React.memo(() => {
  const homepageLinkTitle = getAccessibleTitle(BACK_TO_HOMEPAGE, SERVICE_NAME);

  return (
    <header className="fr-header" data-testid="HeaderComponent" role="banner">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <Link title={homepageLinkTitle} to="/">
                    <LogoRepubliqueFrancaiseComponent />
                  </Link>
                </div>
                <div className="fr-header__operator">
                  <img
                    alt="FranceConnect, 10 ans de simplification de l’accès aux démarches"
                    className="fr-responsive-img"
                    src={LogoFranceConnect10Ans as unknown as string}
                  />
                </div>
              </div>
              <div className="fr-header__service">
                <Link title={homepageLinkTitle} to="/">
                  <p className="fr-header__service-title" data-testid="HeaderComponent-title">
                    {SERVICE_NAME}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

HeaderComponent.displayName = 'HeaderComponent';
