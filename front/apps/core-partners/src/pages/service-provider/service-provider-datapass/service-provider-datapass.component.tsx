import React from 'react';

import { Strings } from '@fc/common';
import { LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useServiceProviderDatapass } from '../../../hooks';

interface ServiceProviderDatapassComponentProps {
  datapassRequestId: string;
}

export const ServiceProviderDatapassComponent = React.memo(
  ({ datapassRequestId }: ServiceProviderDatapassComponentProps) => {
    const { habilitationLink } = useServiceProviderDatapass(datapassRequestId);

    return (
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mt-4w">
        <h2>{t('Partners.serviceProviderPage.datapass.title')}</h2>
        <hr />
        <ul>
          <li>
            <b>
              {t('Partners.serviceProviderPage.datapass.number')}
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
      </div>
    );
  },
);

ServiceProviderDatapassComponent.displayName = 'ServiceProviderDatapassComponent';
