import React from 'react';

interface ServiceProviderScopesTabViewComponentProps {
  scopes: string[];
  id: string;
}

export const ServiceProviderScopesTabViewComponent = React.memo(
  ({ id, scopes }: ServiceProviderScopesTabViewComponentProps) => (
    <ul>
      {scopes.map((scope, index) => {
        const key = `${id}-scope-${index}`;
        const dataTestId = `service-provider-scopes-tab-${id}-scope-${index}`;
        return (
          <li key={key} data-testid={dataTestId}>
            {scope}
          </li>
        );
      })}
    </ul>
  ),
);

ServiceProviderScopesTabViewComponent.displayName = 'ServiceProviderScopesTabViewComponent';
