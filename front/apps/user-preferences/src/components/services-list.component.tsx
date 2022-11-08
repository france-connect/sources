import './user-preferences.scss';

import React, { useContext } from 'react';

import { AccountContext, AccountInterface } from '@fc/account';
import { UserInfosInterface } from '@fc/user-dashboard';

import { Service } from '../interfaces';
import { ServiceComponent } from './service.component';

interface ServicesListComponentProps {
  identityProviders: Service[] | undefined;
}

export const ServicesListComponent: React.FC<ServicesListComponentProps> = React.memo(
  ({ identityProviders }: ServicesListComponentProps) => {
    /*
      @TODO use <AccountInterface<UserInfosInterface>> type
      Author: Matthieu
      Date: 2022-10-06
    */
    const { userinfos } = useContext<AccountInterface>(AccountContext);
    const currentLoggedInIdentityProvider = (userinfos as UserInfosInterface)?.idpId;

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
