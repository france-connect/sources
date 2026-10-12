import { render } from '@testing-library/react';

import { Sizes } from '../../enums';
import { TableCaptionComponent } from './caption';
import { TableHeaderComponent } from './header';
import { TableRowComponent } from './row';
import { TableComponent } from './table.component';
import { TableWrapperComponent } from './wrapper';

jest.mock('./header/table-header.component');
jest.mock('./caption/table-caption.component');
jest.mock('./row/table-row.component');
jest.mock('./wrapper/table-wrapper.component');

describe('TableComponent', () => {
  // Given
  const columnsMock = [
    { key: 'column1', label: 'column-mock-1' },
    { key: 'column2', label: 'column-mock-2' },
  ];

  it('should match the snapshot with required props', () => {
    // When
    const { container } = render(
      <TableComponent
        columns={columnsMock}
        id="any-table-id-mock"
        sources={[
          { column1: 'Data 1', column2: 'Data 2', label: 'column-mock-1' },
          { column1: 'Data 3', column2: 'Data 4', label: 'column-mock-2' },
        ]}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(TableWrapperComponent).toHaveBeenCalledExactlyOnceWith(
      {
        bordered: false,
        children: expect.any(Object),
        id: 'any-table-id-mock',
        multiline: false,
        noScroll: false,
        selectable: undefined,
        size: Sizes.MEDIUM,
        toolbar: undefined,
      },
      undefined,
    );
    expect(TableHeaderComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: columnsMock,
        selectable: undefined,
        showActionsColumn: false,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should match the snapshot with optionnals props', () => {
    // Given
    const containerStyleMock = 'container-classname-mock';
    const rowStyleMock = 'row-classname-mock';
    const stylesMock = {
      container: containerStyleMock,
      row: rowStyleMock,
    };
    const sourcesMock = [
      { column1: 'Data 1', column2: 'Data 2', label: 'column-mock-1' },
      { column1: 'Data 3', column2: 'Data 4', label: 'column-mock-2' },
    ];

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
        sources={sourcesMock}
        styles={stylesMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass(containerStyleMock);
    expect(TableWrapperComponent).toHaveBeenCalledExactlyOnceWith(
      {
        bordered: true,
        children: expect.any(Object),
        id: 'any-table-id-mock',
        multiline: false,
        noScroll: false,
        selectable: undefined,
        size: Sizes.LARGE,
        toolbar: undefined,
      },
      undefined,
    );
    expect(TableCaptionComponent).toHaveBeenCalledExactlyOnceWith(
      {
        caption: 'Table Caption',
      },
      undefined,
    );
    expect(TableHeaderComponent).not.toHaveBeenCalled();
    expect(TableRowComponent).toHaveBeenCalledTimes(2);
    expect(TableRowComponent).toHaveBeenNthCalledWith(
      1,
      {
        actions: undefined,
        className: rowStyleMock,
        columns: columnsMock,
        data: sourcesMock[0],
        index: 0,
        selectable: undefined,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
    expect(TableRowComponent).toHaveBeenNthCalledWith(
      2,
      {
        actions: undefined,
        className: rowStyleMock,
        columns: columnsMock,
        data: sourcesMock[1],
        index: 1,
        selectable: undefined,
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
        selectable: undefined,
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
        selectable: undefined,
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
        selectable: undefined,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should create columns from sources if not provided', () => {
    // Given
    const sourcesMock = [
      { column1: 'Data 1', column2: 'Data 2', label: 'column-mock-1' },
      { column1: 'Data 3', column2: 'Data 4', label: 'column-mock-2' },
    ];
    const expectedColumns = [
      { key: 'column1', label: 'column1' },
      { key: 'column2', label: 'column2' },
      { key: 'label', label: 'label' },
    ];

    // When
    render(<TableComponent id="any-table-id-mock" sources={sourcesMock} />);

    // Then
    expect(TableHeaderComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: expectedColumns,
        selectable: undefined,
        showActionsColumn: false,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
    expect(TableRowComponent).toHaveBeenNthCalledWith(
      1,
      {
        actions: undefined,
        className: undefined,
        columns: expectedColumns,
        data: sourcesMock[0],
        index: 0,
        selectable: undefined,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should propagate selectable to wrapper, header and rows', () => {
    // Given
    const selectableMock = {
      checkIfItemIsSelected: jest.fn(),
      isAllItemsSelected: false,
      selection: new Set<string>(),
      toggleAllItems: jest.fn(),
      toggleOneItem: jest.fn(),
    };
    const sourcesMock = [
      { column1: 'Data 1', column2: 'Data 2', id: 'id-1', label: 'column-mock-1' },
    ];

    // When
    render(
      <TableComponent
        columns={columnsMock}
        id="any-table-id-mock"
        selectable={selectableMock}
        sources={sourcesMock}
      />,
    );

    // Then
    expect(TableWrapperComponent).toHaveBeenCalledExactlyOnceWith(
      {
        bordered: false,
        children: expect.any(Object),
        id: 'any-table-id-mock',
        multiline: false,
        noScroll: false,
        selectable: selectableMock,
        size: Sizes.MEDIUM,
        toolbar: undefined,
      },
      undefined,
    );
    expect(TableHeaderComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: columnsMock,
        selectable: selectableMock,
        showActionsColumn: false,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
    expect(TableRowComponent).toHaveBeenCalledExactlyOnceWith(
      {
        actions: undefined,
        className: undefined,
        columns: columnsMock,
        data: sourcesMock[0],
        index: 0,
        selectable: selectableMock,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should propagate toolbar to wrapper', () => {
    // Given
    const selectableMock = {
      checkIfItemIsSelected: jest.fn(),
      isAllItemsSelected: false,
      selection: new Set<string>(),
      toggleAllItems: jest.fn(),
      toggleOneItem: jest.fn(),
    };
    const sourcesMock = [
      { column1: 'Data 1', column2: 'Data 2', id: 'id-1', label: 'column-mock-1' },
    ];
    const toolbarMock = { selectAll: true };

    // When
    render(
      <TableComponent
        columns={columnsMock}
        id="any-table-id-mock"
        selectable={selectableMock}
        sources={sourcesMock}
        toolbar={toolbarMock}
      />,
    );

    // Then
    expect(TableWrapperComponent).toHaveBeenCalledExactlyOnceWith(
      {
        bordered: false,
        children: expect.any(Object),
        id: 'any-table-id-mock',
        multiline: false,
        noScroll: false,
        selectable: selectableMock,
        size: Sizes.MEDIUM,
        toolbar: toolbarMock,
      },
      undefined,
    );
  });
});
