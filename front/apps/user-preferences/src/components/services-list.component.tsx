import './user-preferences.scss';

import React from 'react';

import { useAccountContext } from '@fc/account';
import type { DashboardUserInfosInterface } from '@fc/core-user-dashboard';

import type { ServiceInterface } from '../interfaces';
import { ServiceComponent } from './service.component';

interface ServicesListComponentProps {
  identityProviders: ServiceInterface[] | undefined;
}

export const ServicesListComponent: React.FC<ServicesListComponentProps> = React.memo(
  ({ identityProviders }: ServicesListComponentProps) => {
    const { userinfos } = useAccountContext<DashboardUserInfosInterface>();
    const currentLoggedInIdentityProvider = userinfos?.idpId;

    return (
      <ul className="fr-toggle__list">
        {identityProviders &&
          identityProviders.map((idp) => {
            const allowToBeUpdated = idp.uid !== currentLoggedInIdentityProvider;
            return (
              <ServiceComponent key={idp.uid} allowToBeUpdated={allowToBeUpdated} service={idp} />
            );
          })}
      </ul>
    );
  },
);

ServicesListComponent.displayName = 'ServicesListComponent';
