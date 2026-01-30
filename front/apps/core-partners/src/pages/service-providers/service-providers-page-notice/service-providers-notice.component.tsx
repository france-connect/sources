import React from 'react';

import { AlertComponent, CalloutComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface ServiceProvidersPageNoticeComponentProps {
  hasItems: boolean;
}

export const ServiceProvidersPageNoticeComponent = React.memo(
  ({ hasItems }: ServiceProvidersPageNoticeComponentProps) => {
    const Component = hasItems ? CalloutComponent : AlertComponent;
    const dataTestId = hasItems
      ? 'service-providers-page-notice-callout'
      : 'service-providers-page-notice-alert';
    return (
      <Component
        className="fr-mt-5w"
        dataTestId={dataTestId}
        icon="info-line"
        title={t('CorePartners.serviceProvidersPage.noticeTitle')}>
        <div>
          <p>{t('CorePartners.serviceProvidersPage.noticeSubtitle')}</p>
          <ul>
            <li>{t('CorePartners.serviceProvidersPage.noticeBullet1')}</li>
            <li>{t('CorePartners.serviceProvidersPage.noticeBullet2')}</li>
            <li>{t('CorePartners.serviceProvidersPage.noticeBullet3')}</li>
          </ul>
        </div>
      </Component>
    );
  },
);

ServiceProvidersPageNoticeComponent.displayName = 'ServiceProvidersPageNoticeComponent';
