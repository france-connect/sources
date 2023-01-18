import React from 'react';
import { useParams } from 'react-router-dom';

import { ServiceProviderHeaderComponent } from '../../../components';
import { ServiceProvidersActionTypes } from '../../../enums';
import { useServiceProviderDetails } from '../../../hooks';

export const ServiceProviderReadPage = React.memo(() => {
  const { id } = useParams() as { id: string };
  const { item } = useServiceProviderDetails({
    id,
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_REQUESTED,
  });

  return (
    <div>
      {item && (
        <div className="fr-container fr-mt-3w">
          <ServiceProviderHeaderComponent item={item} />
        </div>
      )}
    </div>
  );
});

ServiceProviderReadPage.displayName = 'ServiceProviderReadPage';
