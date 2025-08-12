import { render } from '@testing-library/react';
import React from 'react';

import { Sizes } from '../../enums';
import { TableCaptionComponent } from './caption';
import { TableHeaderComponent } from './header';
import { TableComponent } from './table.component';

jest.mock('./header/table-header.component');
jest.mock('./caption/table-caption.component');

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
        scrollable={false}
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
    expect(container.firstChild).toHaveClass('fr-table--no-scroll');
    expect(TableCaptionComponent).toHaveBeenCalledExactlyOnceWith(
      {
        caption: 'Table Caption',
      },
      undefined,
    );
    expect(TableHeaderComponent).not.toHaveBeenCalled();
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
