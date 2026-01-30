import React from 'react';

import { Strings } from '@fc/common';
import { IconPlacement, LinkButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const ServiceProviderErrorPage = React.memo(() => (
  <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
    <div className="fr-col-12">
      <h1>
        {t('CorePartners.serviceProviderPage.noticeTitle', { NBSP_UNICODE: Strings.NBSP_UNICODE })}
      </h1>
      <p className="fr-text--lead">
        {t('CorePartners.serviceProvidersPage.noticeSubtitle', {
          NBSP_UNICODE: Strings.NBSP_UNICODE,
        })}
      </p>
      <ul>
        <li>{t('CorePartners.serviceProvidersPage.noticeBullet1')}</li>
        <li>{t('CorePartners.serviceProvidersPage.noticeBullet2')}</li>
        <li>{t('CorePartners.serviceProvidersPage.noticeBullet3')}</li>
      </ul>
      <div className="fr-mt-5w">
        <LinkButton
          icon="arrow-go-back-fill"
          iconPlacement={IconPlacement.LEFT}
          link="/fournisseurs-de-service">
          {t('CorePartners.serviceProvidersPage.backToServiceProviders')}
        </LinkButton>
      </div>
    </div>
  </div>
));

ServiceProviderErrorPage.displayName = 'ServiceProviderErrorPage';
