import React from 'react';

import {
  ServiceProvidersListComponent,
  ServiceProvidersPageNoticeComponent,
} from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useServiceProviders } from '../../../hooks';

export const ServiceProvidersPage = React.memo(() => {
  const { hasItems, items } = useServiceProviders();

  return (
    <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
      <div className="fr-col-12">
        <h1 data-testid="service-providers-page-title">
          {t('CorePartners.serviceProvidersPage.title')}
        </h1>
      </div>
      {hasItems && (
        <div className="fr-col-12 fr-mb-3w fr-mt-5w">
          <ServiceProvidersListComponent items={items} />
        </div>
      )}
      <div className="fr-col-12 fr-mt-5w">
        <ServiceProvidersPageNoticeComponent hasItems={hasItems} />
      </div>
    </div>
  );
});

ServiceProvidersPage.displayName = 'ServiceProvidersPage';
