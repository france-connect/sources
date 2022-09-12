import React from 'react';

import { t } from '@fc/i18n';

export interface ServiceProvidersPageTitleComponentProps {
  totalItems: number;
}

export const ServiceProvidersPageTitleComponent = React.memo(
  ({ totalItems }: ServiceProvidersPageTitleComponentProps) => {
    const label = t('ServiceProvidersPage.title', { count: totalItems });
    return (
      <h1
        className="text-left is-blue-france"
        data-testid="ServiceProvidersPageTitleComponent-title">
        {label}
      </h1>
    );
  },
);

ServiceProvidersPageTitleComponent.displayName = 'ServiceProvidersPageTitleComponent';
