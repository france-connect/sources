import classnames from 'classnames';
import React, { useMemo } from 'react';

import { ucfirst } from '@fc/common';

import { Sizes } from '../../enums';
import type { TableColumnInterface, TableDataSourceInterface } from '../../interfaces';
import { TableCaptionComponent } from './caption';
import { TableHeaderComponent } from './header';
import { TableRowComponent } from './row';

type TableComponentStyles = {
  table?: string;
  header?: string;
  row?: string;
};

interface TableComponentProps<T extends TableDataSourceInterface> {
  // @TODO implement alignment, wrap, sort, into the table component
  // @SEE https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/tableau
  caption?: string;
  size?: Sizes;
  id: string;
  sources: T[];
  hideHeader?: boolean;
  bordered?: boolean;
  styles?: TableComponentStyles;
  scrollable?: boolean;
  columns?: TableColumnInterface[];
}

export const TableComponent = React.memo(
  <T extends TableDataSourceInterface>({
    bordered = false,
    caption,
    columns = undefined,
    hideHeader = false,
    id,
    scrollable = true,
    size = Sizes.MEDIUM,
    sources,
    styles = {},
  }: TableComponentProps<T>) => {
    const tableColumns = useMemo(() => {
      if (columns && columns.length > 0) {
        return columns;
      }
      const result = Object.keys(sources[0]).map((key) => {
        const label = ucfirst(key);
        return { key, label } as TableColumnInterface;
      });
      return result;
    }, [columns, sources]);

    return (
      <div
        className={classnames(`fr-table--${size} fr-table`, styles.table, {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-table--bordered': bordered,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-table--no-scroll': !scrollable,
        })}
        id={id}>
        <div className="fr-table__wrapper">
          <div className="fr-table__container">
            <div className="fr-table__content">
              <table id={`${id}--table`}>
                {caption && <TableCaptionComponent caption={caption} />}
                {!hideHeader && <TableHeaderComponent columns={tableColumns} />}
                <tbody>
                  {sources.map((item, index) => {
                    const key = `${id}--row-${index}`;
                    return (
                      <TableRowComponent
                        key={key}
                        className={styles.row}
                        columns={tableColumns}
                        data={item}
                        index={index}
                        tableId={id}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TableComponent.displayName = 'TableComponent';
