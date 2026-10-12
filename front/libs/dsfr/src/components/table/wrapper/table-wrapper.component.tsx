import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

import type { SelectableInterface } from '@fc/common';

import type { Sizes } from '../../../enums';
import type { TableDataSourceInterface, TableToolbarInterface } from '../../../interfaces';
import { TableToolbarComponent } from '../toolbar';

interface TableWrapperComponentProps<T> extends PropsWithChildren {
  id: string;
  size?: Sizes;
  bordered?: boolean;
  multiline?: boolean;
  noScroll?: boolean;
  selectable?: SelectableInterface<T>;
  toolbar?: TableToolbarInterface;
}

function TableWrapperComponentInner<T extends TableDataSourceInterface>({
  bordered,
  children,
  id,
  multiline,
  noScroll,
  selectable,
  size,
  toolbar = {},
}: TableWrapperComponentProps<T>) {
  const showToolbar = Object.values(toolbar).some(Boolean);

  return (
    <div
      className={classnames(`fr-table--${size} fr-table`, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-table--bordered': bordered,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-table--multiline': multiline,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-table--no-scroll': noScroll,
      })}
      data-fr-js-table="true"
      id={`${id}--wrapper`}>
      {showToolbar && (
        <TableToolbarComponent selectable={selectable} tableId={id} toolbar={toolbar} />
      )}
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id={`${id}--table`}>{children}</table>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TableWrapperComponent = React.memo(
  TableWrapperComponentInner,
) as typeof TableWrapperComponentInner;
