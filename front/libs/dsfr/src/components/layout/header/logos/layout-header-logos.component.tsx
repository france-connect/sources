import React from 'react';

import { LogoRepubliqueFrancaiseComponent } from '../../../logos';
import { LayoutHomepageLinkComponent } from '../../homepage-link';

export interface LayoutHeaderLogosComponentProps {
  logo?: string;
  title?: string;
}

export const LayoutHeaderLogosComponent: React.FC<LayoutHeaderLogosComponentProps> = React.memo(
  ({ logo: ApplicationLogo, title }: LayoutHeaderLogosComponentProps): JSX.Element => (
    <React.Fragment>
      <div className="fr-header__logo">
        <LayoutHomepageLinkComponent>
          <LogoRepubliqueFrancaiseComponent />
        </LayoutHomepageLinkComponent>
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
