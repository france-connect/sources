import React from 'react';

import type { ISODate } from '@fc/common';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { VersionInterface } from '../../interfaces';

interface InstanceComponentProps {
  id: string;
  name: string;
  createdAt: ISODate;
  data: VersionInterface['data'];
}

export const InstanceComponent = React.memo(
  ({ createdAt, data, id, name }: InstanceComponentProps) => {
    const date = t('CorePartners.instance.createdAt', { date: createdAt });

    const clientId = data.client_id;
    const clientSecret = data.client_secret;

    return (
      <CardComponent
        enlargeLink
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

InstanceComponent.displayName = 'InstanceComponent';
