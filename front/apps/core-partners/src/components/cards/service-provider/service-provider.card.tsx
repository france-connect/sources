import React from 'react';

import { HeadingTag, isoToDate, type PropsWithClassName, Strings } from '@fc/common';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import type { ServiceProviderInterface } from '@fc/partners-service-providers';

interface ServiceProviderCardComponentProps extends PropsWithClassName {
  data: ServiceProviderInterface;
}

export const ServiceProviderCardComponent = React.memo(
  ({ className, data }: ServiceProviderCardComponentProps) => {
    const { createdAt, datapassRequestId, name, organizationName } = data;

    const formattedCreatedDate = isoToDate(createdAt);
    const createdDate = t('FC.Common.createdAt.male', { date: formattedCreatedDate });

    const habilitationNumberText = t('CorePartners.serviceProvidersPage.datapassRequestId', {
      NBSP_UNICODE: Strings.NBSP_UNICODE,
    });

    return (
      <CardComponent
        enlargeLink
        className={className}
        details={{ top: { content: createdDate } }}
        Heading={HeadingTag.H4}
        size={Sizes.MEDIUM}
        title={name}>
        <p className="is-uppercase fr-text--sm fr-mb-2w">
          <b>{organizationName}</b>
        </p>
        <p>
          <b>{habilitationNumberText}</b>
          <span
            className="is-block is-inline--md"
            data-testid="ServiceProviderCardComponent-request-id">
            {datapassRequestId}
          </span>
        </p>
      </CardComponent>
    );
  },
);

ServiceProviderCardComponent.displayName = 'ServiceProviderCardComponent';
