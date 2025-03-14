import { DateTime } from 'luxon';
import React from 'react';

import type { ISODate, PropsWithClassName } from '@fc/common';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { VersionInterface } from '../../interfaces';

interface InstanceComponentProps extends PropsWithClassName {
  id: string;
  createdAt: ISODate;
  data: VersionInterface['data'];
}

export const InstanceComponent = React.memo(
  ({ className, createdAt, data, id }: InstanceComponentProps) => {
    const formattedDate = DateTime.fromISO(createdAt, { zone: 'utc' }).toFormat('dd/MM/yyyy');
    const date = t('CorePartners.instance.createdAt', { date: formattedDate });

    const { client_id: clientId, client_secret: clientSecret, name } = data;

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

InstanceComponent.displayName = 'InstanceComponent';
