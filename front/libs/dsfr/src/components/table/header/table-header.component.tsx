import React from 'react';

import type { PropsWithClassName } from '@fc/common';

import type { TableColumnInterface } from '../../../interfaces';

interface TableHeaderComponentProps extends PropsWithClassName {
  columns: Array<Pick<TableColumnInterface, 'label'>>;
  tableId: string;
}

function TableHeaderComponentInner({ className, columns, tableId }: TableHeaderComponentProps) {
  return (
    <thead className={className}>
      <tr>
        {columns.map((item, idx) => {
          const uniqKey = `${tableId}--th-${idx}`;
          return (
            <th key={uniqKey} scope="col">
              {item.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export const TableHeaderComponent = React.memo(
  TableHeaderComponentInner,
) as typeof TableHeaderComponentInner;
