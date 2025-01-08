import React from 'react';

import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { InstanceInterface } from '../../interfaces';

interface InstanceComponentProps {
  item: InstanceInterface;
}

export const InstanceComponent = React.memo(({ item }: InstanceComponentProps) => {
  const date = t('CorePartners.instance.createdAt', { date: item.createdAt });

  return (
    <CardComponent
      enlargeLink
      details={{
        top: {
          className: 'fr-icon-arrow-right-line',
          content: date,
        },
      }}
      link={item.id}
      size={Sizes.LARGE}
      title={item.name}
    />
  );
});

InstanceComponent.displayName = 'InstanceComponent';
