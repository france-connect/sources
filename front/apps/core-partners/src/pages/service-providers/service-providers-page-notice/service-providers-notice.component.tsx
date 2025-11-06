import React from 'react';

import { AlertComponent, CalloutComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface ServiceProvidersPageNoticeComponentProps {
  hasItems: boolean;
}

export const ServiceProvidersPageNoticeComponent = React.memo(
  ({ hasItems }: ServiceProvidersPageNoticeComponentProps) => {
    const Component = hasItems ? CalloutComponent : AlertComponent;
    return (
      <Component
        className="fr-mt-5w"
        dataTestId="service-providers-page-callout"
        icon="info-line"
        title={t('CorePartners.serviceProvidersPage.calloutTitle')}>
        <div>
          <p>{t('CorePartners.serviceProvidersPage.calloutSubtitle')}</p>
          <ul>
            <li>{t('CorePartners.serviceProvidersPage.calloutBullet1')}</li>
            <li>{t('CorePartners.serviceProvidersPage.calloutBullet2')}</li>
            <li>{t('CorePartners.serviceProvidersPage.calloutBullet3')}</li>
          </ul>
        </div>
      </Component>
    );
  },
);

ServiceProvidersPageNoticeComponent.displayName = 'ServiceProvidersPageNoticeComponent';
