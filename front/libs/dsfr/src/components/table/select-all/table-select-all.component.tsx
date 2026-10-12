import classnames from 'classnames';
import React from 'react';

import type { SelectableInterface } from '@fc/common';
import { t } from '@fc/i18n';

import { SelectionTypes } from '../../../enums';
import type { TableDataSourceInterface } from '../../../interfaces';
import { CheckboxComponent } from '../../checkbox';

interface TableSelectAllComponentProps<T> {
  tableId: string;
  className?: string;
  selectable: SelectableInterface<T>;
}

function TableSelectAllInner<T extends TableDataSourceInterface>({
  className,
  selectable,
  tableId,
}: TableSelectAllComponentProps<T>) {
  const id = `${tableId}--select-all`;

  const { isAllItemsSelected, selection, toggleAllItems } = selectable;

  const hasSelection = selection.size > 0;
  const indeterminate = hasSelection && !isAllItemsSelected;

  return (
    <div
      className={classnames('fr-mb-3w fr-p-2w fr-border-default--grey is-inline-block', className)}>
      <CheckboxComponent
        checked={isAllItemsSelected}
        id={id}
        indeterminate={indeterminate}
        label={t('DSFR.table.selectAll.label')}
        selection={SelectionTypes.MULTIPLE}
        onChange={toggleAllItems}
      />
    </div>
  );
}

export const TableSelectAllComponent = React.memo(
  TableSelectAllInner,
) as typeof TableSelectAllInner;
