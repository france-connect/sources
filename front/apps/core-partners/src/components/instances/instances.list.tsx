import React from 'react';

import { sortByKey, SortOrder } from '@fc/common';

import type { InstanceInterface } from '../../interfaces';
import { InstanceComponent } from '../instance';

interface InstancesListComponentProps {
  items: InstanceInterface[];
}

export const InstancesListComponent = React.memo(({ items }: InstancesListComponentProps) => (
  <div className="fr-col-12">
    {items
      .sort(sortByKey('updatedAt', SortOrder.DESC))
      .map(({ createdAt, id, versions }, index) => {
        const { data } = versions[0];
        const uniqkey = `instance::${id}`;
        const className = index > 0 ? 'fr-mt-2w' : undefined;
        return (
          <InstanceComponent
            key={uniqkey}
            className={className}
            createdAt={createdAt}
            data={data}
            id={id}
          />
        );
      })}
  </div>
));

InstancesListComponent.displayName = 'InstancesListComponent';
