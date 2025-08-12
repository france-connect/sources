import './user-preferences.scss';

import React from 'react';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';
import type { DashboardUserInfosInterface } from '@fc/core-user-dashboard';

import type { ServiceInterface } from '../interfaces';
import { ServiceComponent } from './service.component';

interface ServicesListComponentProps {
  identityProviders: ServiceInterface[] | undefined;
}

export const ServicesListComponent: React.FC<ServicesListComponentProps> = React.memo(
  ({ identityProviders }: ServicesListComponentProps) => {
    const { userinfos } = useSafeContext<AccountContextState>(AccountContext);
    const currentLoggedInIdentityProvider = (userinfos as DashboardUserInfosInterface)?.idpId;

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
