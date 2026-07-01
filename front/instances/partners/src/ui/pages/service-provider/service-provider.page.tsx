import React from 'react';

import {
  ServiceProviderDatapassComponent,
  ServiceProviderNameComponent,
  ServiceProviderPermissionsComponent,
  ServiceProviderSandboxesComponent,
  ServiceProviderScopesComponent,
} from '@fc/core-partners';

import { useServiceProvider } from '../../../hooks';

export const ServiceProviderPage = React.memo(() => {
  const { permissions, serviceProvider } = useServiceProvider();

  return (
    <React.Fragment>
      <ServiceProviderNameComponent
        name={serviceProvider.name}
        organizationName={serviceProvider.organization.name}
      />
      <ServiceProviderDatapassComponent datapassRequestId={serviceProvider.datapassRequestId} />
      <ServiceProviderScopesComponent
        datapassScopes={serviceProvider.datapassScopes}
        fcScopes={serviceProvider.fcScopes}
      />
      <ServiceProviderPermissionsComponent permissions={permissions} />
      <ServiceProviderSandboxesComponent instances={serviceProvider.instances} />
    </React.Fragment>
  );
});

ServiceProviderPage.displayName = 'ServiceProviderPage';
