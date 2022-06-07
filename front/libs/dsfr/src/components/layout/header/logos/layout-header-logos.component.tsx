import React from 'react';
import { Link } from 'react-router-dom';

import { LogoRepubliqueFrancaiseComponent } from '../../../logos';

interface LayoutHeaderLogosComponentProps {
  logo?: string;
  title?: string;
}

export const LayoutHeaderLogosComponent: React.FC<LayoutHeaderLogosComponentProps> = React.memo(
  ({ logo: ApplicationLogo, title }: LayoutHeaderLogosComponentProps): JSX.Element => (
    <React.Fragment>
      <div className="fr-header__logo">
        <Link title={`Accueil - ${title || ''}`} to="/">
          <LogoRepubliqueFrancaiseComponent />
        </Link>
      </div>
      {ApplicationLogo && (
        <div className="fr-header__operator">
          <img
            alt={title}
            className="fr-responsive-img"
            src={ApplicationLogo}
            style={{ height: 54, maxHeight: 54 }}
          />
        </div>
      )}
    </React.Fragment>
  ),
);

LayoutHeaderLogosComponent.defaultProps = {
  logo: undefined,
  title: undefined,
};

LayoutHeaderLogosComponent.displayName = 'LayoutHeaderLogosComponent';
