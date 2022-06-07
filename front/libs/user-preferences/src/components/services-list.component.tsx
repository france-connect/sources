import './user-preferences.scss';

import React from 'react';

import { Service } from '../interfaces';
import { ServiceComponent } from './service.component';

interface ServicesListComponentProps {
  identityProviders: Service[] | undefined;
}

export const ServicesListComponent: React.FC<ServicesListComponentProps> = React.memo(
  ({ identityProviders }: ServicesListComponentProps) => (
    <ul className="fr-toggle__list">
      {identityProviders &&
        identityProviders.map((idp) => <ServiceComponent key={idp.uid} service={idp} />)}
    </ul>
  ),
);

ServicesListComponent.displayName = 'ServicesListComponent';
