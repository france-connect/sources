import React from 'react';

import { isoToDate, type PropsWithClassName } from '@fc/common';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import type { InstanceInterface } from '@fc/partners-service-providers';

interface InstanceCardComponentProps extends PropsWithClassName {
  data: InstanceInterface;
}

export const InstanceCardComponent = React.memo(
  ({ className, data }: InstanceCardComponentProps) => {
    const { createdAt, id, versions } = data;

    const formattedDate = isoToDate(createdAt);
    const date = t('FC.Common.createdAt.female', { date: formattedDate });

    const { client_id: clientId, client_secret: clientSecret, name } = versions[0].data;

    return (
      <CardComponent
        enlargeLink
        className={className}
        details={{
          top: {
            className: 'fr-icon-arrow-right-line',
            content: date,
          },
        }}
        link={id}
        size={Sizes.LARGE}
        title={name}>
        <p>
          <b className="is-block">Client ID</b>
          <span data-testid="InstanceComponent-client-id">{clientId}</span>
        </p>
        <p>
          <b className="is-block">Client Secret</b>
          <span data-testid="InstanceComponent-client-secret">{clientSecret}</span>
        </p>
      </CardComponent>
    );
  },
);

InstanceCardComponent.displayName = 'InstanceComponent';
