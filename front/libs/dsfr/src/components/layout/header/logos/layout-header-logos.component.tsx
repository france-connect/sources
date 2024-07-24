import React from 'react';

import { LogoRepubliqueFrancaiseComponent } from '../../../logos';
import { LayoutHomepageLinkComponent } from '../../homepage-link';

interface LayoutHeaderLogosComponentProps {
  logo?: string;
  title?: string;
}

export const LayoutHeaderLogosComponent = React.memo(
  ({ logo: ApplicationLogo, title }: LayoutHeaderLogosComponentProps) => (
    <React.Fragment>
      <div className="fr-header__logo">
        <LayoutHomepageLinkComponent>
          <LogoRepubliqueFrancaiseComponent />
        </LayoutHomepageLinkComponent>
      </div>
      {ApplicationLogo && (
        <div className="fr-header__operator">
          <img alt={title} className="fr-responsive-img" src={ApplicationLogo} />
        </div>
      )}
    </React.Fragment>
  ),
);

LayoutHeaderLogosComponent.displayName = 'LayoutHeaderLogosComponent';
