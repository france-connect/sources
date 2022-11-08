import React from 'react';

export interface ServiceProvidersListItemDetailComponentProps {
  label: string;
  dataTestId?: string;
  lastItem?: boolean;
}

export const ServiceProvidersListItemDetailComponent: React.FC<ServiceProvidersListItemDetailComponentProps> =
  React.memo(({ dataTestId, label, lastItem }: ServiceProvidersListItemDetailComponentProps) => (
    <span className="is-inline-block">
      <span data-testid={dataTestId}>{label}</span>
      {!lastItem && <span className="fr-mx-2w">•</span>}
    </span>
  ));

ServiceProvidersListItemDetailComponent.defaultProps = {
  dataTestId: 'ServiceProvidersListItemDetailComponent-label',
  lastItem: false,
};

ServiceProvidersListItemDetailComponent.displayName = 'ServiceProvidersListItemDetailComponent';
