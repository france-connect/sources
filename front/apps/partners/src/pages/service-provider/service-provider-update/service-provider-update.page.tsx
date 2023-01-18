import React from 'react';
import { useParams } from 'react-router-dom';

import {
  ServiceProviderHeaderComponent,
  ServiceProviderSandboxComponent,
} from '../../../components';
import { ServiceProvidersActionTypes } from '../../../enums';
import { useServiceProviderDetails } from '../../../hooks';

export const ServiceProviderUpdatePage = React.memo(() => {
  const { id } = useParams() as { id: string };
  const { item } = useServiceProviderDetails({
    id,
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_REQUESTED,
  });

  return (
    <div className="fr-container fr-mt-3w">
      {item && (
        <React.Fragment>
          <ServiceProviderHeaderComponent item={item} />
          <ServiceProviderSandboxComponent id={id} />
        </React.Fragment>
      )}
    </div>
  );
});

ServiceProviderUpdatePage.displayName = 'ServiceProviderUpdatePage';
