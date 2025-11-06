import React from 'react';

import { sortByKey, SortOrder } from '@fc/common';
import type { ServiceProviderInterface } from '@fc/partners-service-providers';

import { ServiceProviderCardComponent } from '../../cards';

interface ServiceProvidersListComponentProps {
  items: ServiceProviderInterface[];
}

export const ServiceProvidersListComponent = React.memo(
  // @NOTE ESLint false positive react/prop-types + React.memo
  // eslint-disable-next-line react/prop-types
  ({ items }: ServiceProvidersListComponentProps) =>
    // @NOTE ESLint false positive react/prop-types + React.memo
    // eslint-disable-next-line react/prop-types
    items.sort(sortByKey('updatedAt', SortOrder.DESC)).map((data, index) => {
      const uniqkey = `service-provider::${data.id}`;
      const className = index > 0 ? 'fr-mt-2w' : undefined;
      return <ServiceProviderCardComponent key={uniqkey} className={className} data={data} />;
    }),
);

ServiceProvidersListComponent.displayName = 'ServiceProvidersListComponent';
