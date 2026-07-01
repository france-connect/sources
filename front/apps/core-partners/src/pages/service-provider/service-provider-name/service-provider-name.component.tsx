import React from 'react';

interface ServiceProviderNameComponentProps {
  name: string;
  organizationName: string;
}

export const ServiceProviderNameComponent = React.memo(
  ({ name, organizationName }: ServiceProviderNameComponentProps) => (
    <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
      <h1>{name}</h1>
      <p className="is-uppercase" data-testid="service-provider-details-page-organization-name">
        {organizationName}
      </p>
    </div>
  ),
);

ServiceProviderNameComponent.displayName = 'ServiceProviderNameComponent';
