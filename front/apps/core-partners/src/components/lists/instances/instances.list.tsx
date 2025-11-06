import React from 'react';

import { sortByKey, SortOrder } from '@fc/common';
import type { InstanceInterface } from '@fc/partners-service-providers';

import { InstanceCardComponent } from '../../cards/instance';

interface InstancesListComponentProps {
  items: InstanceInterface[];
}

// @NOTE ESLint false positive react/prop-types + React.memo
// eslint-disable-next-line react/prop-types
export const InstancesListComponent = React.memo(({ items }: InstancesListComponentProps) =>
  // @NOTE ESLint false positive react/prop-types + React.memo
  // eslint-disable-next-line react/prop-types
  items.sort(sortByKey('updatedAt', SortOrder.DESC)).map((data, index) => {
    const uniqkey = `instance::${data.id}`;
    const className = index > 0 ? 'fr-mt-2w' : undefined;
    return <InstanceCardComponent key={uniqkey} className={className} data={data} />;
  }),
);

InstancesListComponent.displayName = 'InstancesListComponent';
