import React from 'react';

import type { PropsWithClassName } from '@fc/common';

import type { TableColumnInterface } from '../../../interfaces';

interface TableHeaderComponentProps extends PropsWithClassName {
  columns: TableColumnInterface[];
}

export const TableHeaderComponent = React.memo(
  ({ className = undefined, columns }: TableHeaderComponentProps) => (
    <thead className={className}>
      <tr>
        {columns.map((item) => (
          <th key={item.key} scope="col">
            {item.label}
          </th>
        ))}
      </tr>
    </thead>
  ),
);

TableHeaderComponent.displayName = 'TableHeaderComponent';
