import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AccountContext } from '@fc/account';
import { ServiceProvidersActionTypes } from '@fc/service-providers';
import { InitialState } from '@fc/state-management';

import { ServiceProvidersListComponent } from '../service-providers-list';
import { ServiceProvidersPageTitleComponent } from '../service-providers-page-title';

export const ServiceProvidersPage = React.memo(() => {
  const initialized = useRef(false);
  const dispatch = useDispatch();
  // @NOTE unable to mock anonymous function
  // istanbul ignore next
  const { items, loading, totalItems } = useSelector(
    (state: InitialState) => state.ServiceProviders,
  );

  useEffect(() => {
    if (!initialized.current) {
      dispatch({
        type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
      });
      initialized.current = true;
    }
  }, [dispatch]);

  return (
    <AccountContext.Consumer>
      {({ connected }) => {
        const showProvidersList = connected && initialized.current && !loading;
        return (
          <div className="fr-container fr-mt-8w">
            <ServiceProvidersPageTitleComponent totalItems={totalItems} />
            {showProvidersList && (
              <ServiceProvidersListComponent items={items} totalItems={totalItems} />
            )}
            {
              /** @TODO Be careful that this portion of code (L40-45) is no longer present with true connection */
              !connected && (
                <p className="text-center">
                  Vous devez <a href="/login">vous connecter</a> pour accéder à cette page ultra
                  sécurisée
                </p>
              )
            }
          </div>
        );
      }}
    </AccountContext.Consumer>
  );
});

ServiceProvidersPage.displayName = 'ServiceProvidersPage';
