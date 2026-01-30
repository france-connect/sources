import React from 'react';

import { sortByKey, SortOrder } from '@fc/common';

import type { ServiceProviderInterface } from '../../../interfaces';
import { ServiceProviderCardComponent } from '../../cards';

interface ServiceProvidersListComponentProps {
  items: ServiceProviderInterface[];
}

export const ServiceProvidersListComponent = React.memo(
  (props: ServiceProvidersListComponentProps) => {
    const { items } = props;
    const sortedItems = items.sort(sortByKey('updatedAt', SortOrder.DESC));

    return sortedItems.map((data, index) => {
      const uniqkey = `service-provider::${data.id}`;
      const className = index > 0 ? 'fr-mt-2w' : undefined;
      return <ServiceProviderCardComponent key={uniqkey} className={className} data={data} />;
    });
  },
);

ServiceProvidersListComponent.displayName = 'ServiceProvidersListComponent';
