import React from 'react';

import { sortByKey, SortOrder } from '@fc/common';

import type { InstanceInterface } from '../../interfaces';
import { InstanceComponent } from '../instance';

interface InstancesListComponentProps {
  items: InstanceInterface[];
}

export const InstancesListComponent = React.memo(({ items }: InstancesListComponentProps) => (
  <div className="fr-col-12">
    {items.sort(sortByKey('updatedAt', SortOrder.DESC)).map(({ createdAt, id, name, versions }) => {
      const { data } = versions[0];

      const uniqkey = `instance::${id}`;
      return (
        <InstanceComponent key={uniqkey} createdAt={createdAt} data={data} id={id} name={name} />
      );
    })}
  </div>
));

InstancesListComponent.displayName = 'InstancesListComponent';
