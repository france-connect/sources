import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

import type { PropsWithClassName, SelectableInterface } from '@fc/common';

import type { TableDataSourceInterface, TableToolbarInterface } from '../../../interfaces';
import { TableSelectAllComponent } from '../select-all';

interface TableToolbarComponentProps<T> extends PropsWithClassName, PropsWithChildren {
  tableId: string;
  selectable?: SelectableInterface<T>;
  toolbar: TableToolbarInterface;
}

function TableToolbarComponentInner<T extends TableDataSourceInterface>({
  children,
  className,
  selectable,
  tableId,
  toolbar,
}: TableToolbarComponentProps<T>) {
  const showSelectAll = toolbar.selectAll && selectable;

  return (
    <div className={classnames('fr-table__header', className)}>
      {showSelectAll && <TableSelectAllComponent selectable={selectable} tableId={tableId} />}
      {children}
    </div>
  );
}

export const TableToolbarComponent = React.memo(
  TableToolbarComponentInner,
) as typeof TableToolbarComponentInner;
