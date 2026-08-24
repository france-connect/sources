import { render } from '@testing-library/react';
import React from 'react';

import { Sizes } from '../../enums';
import { TableCaptionComponent } from './caption';
import { TableHeaderComponent } from './header';
import { TableRowComponent } from './row';
import { TableComponent } from './table.component';

jest.mock('./header/table-header.component');
jest.mock('./caption/table-caption.component');
jest.mock('./row/table-row.component');

describe('TableComponent', () => {
  // Given
  const columnsMock = [
    { key: 'column1', label: 'column-mock-1' },
    { key: 'column2', label: 'column-mock-2' },
  ];

  it('should match the snapshot with required props', () => {
    // When
    const { container, getByRole } = render(
      <TableComponent
        columns={columnsMock}
        id="any-table-id-mock"
        sources={[
          { column1: 'Data 1', column2: 'Data 2', label: 'column-mock-1' },
          { column1: 'Data 3', column2: 'Data 4', label: 'column-mock-2' },
        ]}
      />,
    );
    const tableElement = getByRole('table');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).not.toHaveClass('fr-table--bordered');
    expect(container.firstChild).not.toHaveClass('fr-table--no-scroll');
    expect(container.firstChild).toHaveAttribute('id', 'any-table-id-mock');
    expect(tableElement).toBeInTheDocument();
    expect(tableElement).toHaveAttribute('id', 'any-table-id-mock--table');
    expect(TableHeaderComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: columnsMock,
        showActionsColumn: false,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should match the snapshot with optionnals props', () => {
    // Given
    const rowStyleMock = Symbol('rowStyleMock') as unknown as string;
    const tableStyleMock = Symbol('tableStyleMock') as unknown as string;
    const headerStyleMock = Symbol('headerStyleMock') as unknown as string;
    const stylesMock = {
      head: headerStyleMock,
      row: rowStyleMock,
      table: tableStyleMock,
    };

    // When
    const { container } = render(
      <TableComponent
        bordered
        hideHeader
        caption="Table Caption"
        columns={columnsMock}
        id="any-table-id-mock"
        noScroll={false}
        size={Sizes.LARGE}
        sources={[
          { column1: 'Data 1', column2: 'Data 2', label: 'column-mock-1' },
          { column1: 'Data 3', column2: 'Data 4', label: 'column-mock-2' },
        ]}
        styles={stylesMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-table--bordered');
    expect(container.firstChild).toHaveClass('fr-table--lg fr-table fr-table--bordered');
    expect(TableCaptionComponent).toHaveBeenCalledExactlyOnceWith(
      {
        caption: 'Table Caption',
      },
      undefined,
    );
    expect(TableHeaderComponent).not.toHaveBeenCalled();
  });

  it('should not show actions column if actions are not provided', () => {
    // Given
    const sourcesMock = [
      { column1: 'Data 1', column2: 'Data 2', id: 'id-1', label: 'column-mock-1' },
      { column1: 'Data 3', column2: 'Data 4', id: 'id-2', label: 'column-mock-2' },
    ];

    // When
    render(<TableComponent columns={columnsMock} id="any-table-id-mock" sources={sourcesMock} />);

    // Then
    expect(TableHeaderComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: columnsMock,
        showActionsColumn: false,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
    expect(TableRowComponent).toHaveBeenCalledTimes(2);
    expect(TableRowComponent).toHaveBeenNthCalledWith(
      1,
      {
        actions: undefined,
        className: undefined,
        columns: columnsMock,
        data: sourcesMock[0],
        index: 0,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
    expect(TableRowComponent).toHaveBeenNthCalledWith(
      2,
      {
        actions: undefined,
        className: undefined,
        columns: columnsMock,
        data: sourcesMock[1],
        index: 1,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should show actions column and propagate actions to rows', () => {
    // Given
    const actionsMock = jest.fn(() => <button type="button">action-mock</button>);
    const sourcesMock = [
      { column1: 'Data 1', column2: 'Data 2', id: 'id-1', label: 'column-mock-1' },
      { column1: 'Data 3', column2: 'Data 4', id: 'id-2', label: 'column-mock-2' },
    ];

    // When
    render(
      <TableComponent
        actions={actionsMock}
        columns={columnsMock}
        id="any-table-id-mock"
        sources={sourcesMock}
      />,
    );

    // Then
    expect(TableHeaderComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: columnsMock,
        showActionsColumn: true,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
    expect(TableRowComponent).toHaveBeenCalledTimes(2);
    expect(TableRowComponent).toHaveBeenNthCalledWith(
      1,
      {
        actions: actionsMock,
        className: undefined,
        columns: columnsMock,
        data: sourcesMock[0],
        index: 0,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
    expect(TableRowComponent).toHaveBeenNthCalledWith(
      2,
      {
        actions: actionsMock,
        className: undefined,
        columns: columnsMock,
        data: sourcesMock[1],
        index: 1,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should create columns from sources if not provided', () => {
    // Given
    const useMemoMock = jest.spyOn(React, 'useMemo');

    // When
    render(
      <TableComponent
        id="any-table-id-mock"
        sources={[
          { column1: 'Data 1', column2: 'Data 2', label: 'column-mock-1' },
          { column1: 'Data 3', column2: 'Data 4', label: 'column-mock-2' },
        ]}
      />,
    );

    // Then
    expect(useMemoMock).toHaveReturnedWith([
      { key: 'column1', label: 'column1' },
      { key: 'column2', label: 'column2' },
      { key: 'label', label: 'label' },
    ]);
  });
});
