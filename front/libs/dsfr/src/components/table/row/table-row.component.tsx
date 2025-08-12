import classnames from 'classnames';
import { get } from 'lodash';
import React from 'react';

import type { PropsWithClassName } from '@fc/common';

import type { TableColumnInterface, TableDataSourceInterface } from '../../../interfaces';

interface TableRowComponentProps<T> extends PropsWithClassName {
  data: T;
  index: number;
  tableId?: string;
  columns: TableColumnInterface[];
}

export const TableRowComponent = React.memo(
  <T extends TableDataSourceInterface>({
    columns,
    data,
    index,
    tableId = undefined,
  }: TableRowComponentProps<T>) => {
    const rowid = tableId ? `${tableId}--row-${index}` : undefined;
    return (
      <tr data-row-key={index} id={rowid}>
        {columns.map((item) => {
          const value = get(data, item.key);
          return (
            <td
              key={item.key}
              className={classnames({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'fr-cell--multiline': !!item.multiline,
              })}>
              {value}
            </td>
          );
        })}
      </tr>
    );
  },
);

TableRowComponent.displayName = 'TableRowComponent';
