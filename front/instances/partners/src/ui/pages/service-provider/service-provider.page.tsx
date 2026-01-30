import React from 'react';

import { Strings } from '@fc/common';
import { LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useServiceProvider } from '../../../hooks';

export const ServiceProviderPage = React.memo(() => {
  const { datapassRequestId, datapassScopes, habilitationLink, id, name, organizationName } =
    useServiceProvider();

  return (
    <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
      <div className="fr-col-12">
        <h1>{name}</h1>
        <p className="is-uppercase">{organizationName}</p>
        <h2 className="fr-mt-7w">{t('Partners.serviceProviderPage.habilitation.title')}</h2>
        <hr />
        <ul>
          <li>
            <b>
              {t('Partners.serviceProviderPage.habilitation.number')}
              {Strings.WHITE_SPACE}
            </b>
            <LinkComponent
              external
              dataTestId="service-provider-details-page-datapass-request-id"
              href={habilitationLink}>
              {datapassRequestId}
            </LinkComponent>
          </li>
        </ul>
        <h2 className="fr-mt-5w">{t('Partners.serviceProviderPage.authorizedData.title')}</h2>
        <hr />
        <p>{t('Partners.serviceProviderPage.authorizedData.description')}</p>
        <ul className="fr-mb-3w">
          {datapassScopes.map((scope, index) => {
            const key = `service-provider-${id}-scope-${index}`;
            return <li key={key}>{scope}</li>;
          })}
        </ul>
        <p>
          {t('Partners.serviceProviderPage.mention')}
          {Strings.WHITE_SPACE}
          <LinkComponent external href={habilitationLink}>
            {t('Partners.serviceProviderPage.habilitation.requestLabel')}
          </LinkComponent>
        </p>
      </div>
    </div>
  );
});

ServiceProviderPage.displayName = 'ServiceProviderPage';
