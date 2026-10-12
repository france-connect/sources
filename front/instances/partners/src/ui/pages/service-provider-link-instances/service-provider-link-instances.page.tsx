import React from 'react';

import {
  ServiceProviderLinkInstancesActionsComponent,
  ServiceProviderLinkInstancesPageHeaderComponent,
  ServiceProviderLinkInstancesTable,
} from '@fc/core-partners';

import { useLinkableInstancesToServiceProvider } from '../../../hooks';

export const ServiceProviderLinkInstancesPage = React.memo(() => {
  const {
    canSubmit,
    handleCancel,
    handleSubmit,
    linkableInstances,
    selectable,
    serviceProviderName,
  } = useLinkableInstancesToServiceProvider();

  return (
    <React.Fragment>
      <ServiceProviderLinkInstancesPageHeaderComponent serviceProviderName={serviceProviderName} />
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
        <ServiceProviderLinkInstancesTable selectable={selectable} sources={linkableInstances} />
        <ServiceProviderLinkInstancesActionsComponent
          canSubmit={canSubmit}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </React.Fragment>
  );
});

ServiceProviderLinkInstancesPage.displayName = 'ServiceProviderLinkInstancesPage';
