import React from 'react';
import { Link } from 'react-router';

import { LogoFranceConnect10Ans } from '@fc/assets';
import { getAccessibleTitle } from '@fc/common';
import { LogoRepubliqueFrancaiseComponent } from '@fc/dsfr';

// @TODO temporary until the login system is in place
export const FooterComponent = React.memo(() => (
  <footer
    className="sticky-footer fr-footer"
    data-testid="FooterComponent"
    id="footer"
    role="contentinfo">
    <div className="fr-container">
      <div className="fr-footer__body">
        <div className="fr-footer__brand fr-enlarge-link">
          <LogoRepubliqueFrancaiseComponent />
          <Link
            className="fr-footer__brand-link"
            title={getAccessibleTitle(
              'Accueil',
              'FranceConnect, 10 ans de simplification de l’accès aux démarches',
            )}
            to="/">
            <img
              alt="FranceConnect, 10 ans de simplification de l’accès aux démarches"
              className="fr-footer__logo fr-responsive-img"
              src={LogoFranceConnect10Ans as unknown as string}
              style={{ height: 90, maxHeight: 90 }}
            />
          </Link>
        </div>
      </div>
    </div>
  </footer>
));

FooterComponent.displayName = 'FooterComponent';
