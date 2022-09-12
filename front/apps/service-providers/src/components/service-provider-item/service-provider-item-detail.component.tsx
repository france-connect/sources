import React from 'react';

export interface ServiceProviderItemDetailComponentProps {
  label: string;
  dataTestId?: string;
  lastItem?: boolean;
}

export const ServiceProviderItemDetailComponent: React.FC<ServiceProviderItemDetailComponentProps> =
  React.memo(({ dataTestId, label, lastItem }: ServiceProviderItemDetailComponentProps) => (
    <span className="is-inline-block">
      <span data-testid={dataTestId}>{label}</span>
      {!lastItem && <span className="fr-mx-2w">•</span>}
    </span>
  ));

ServiceProviderItemDetailComponent.defaultProps = {
  dataTestId: 'ServiceProviderItemDetailComponent-label',
  lastItem: false,
};

ServiceProviderItemDetailComponent.displayName = 'ServiceProviderItemDetailComponent';
