import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { useContentHeight } from '@fc/common';

import { TableRowSelectComponent } from '../row-select';
import { TableRowComponent } from './table-row.component';

jest.mock('../row-select/table-row-select.component');

describe('TableRowComponent', () => {
  // Given
  const tbody = document.createElement('tbody');
  const contentRefMock = React.createRef<HTMLTableRowElement>();
  const columnsMock = [
    {
      key: 'column1',
      label: 'column-mock-1',
    },
    {
      key: 'column2',
      label: 'column-mock-2',
      multiline: true,
    },
    {
      key: 'column3',
      label: 'column-mock-3',
    },
  ];
  const dataMock = {
    column1: 'value1',
    column2: 'value2',
    column3: 'value3',
    id: 'itemIdKey-mock',
    label: 'any-label-mock',
  };

  beforeEach(() => {
    // Given
    jest.mocked(useContentHeight).mockReturnValue({
      contentHeight: 42,
      contentRef: contentRefMock,
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={columnsMock}
        data={dataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('id', 'any-table-id-mock--row-1');
    expect(container.firstChild).toHaveClass('any-classname-mock');
    expect(useContentHeight).toHaveBeenCalledWith({ offset: 2 });
    // DSFR classname
    // eslint-disable-next-line @typescript-eslint/naming-convention
    expect(container.firstChild).toHaveStyle({ '--row-height': '42px' });
  });

  it('should render 3 columns with values', () => {
    // When
    const { container, getByText } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={columnsMock}
        data={dataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );
    const colsElements = container.querySelectorAll('td');
    const col1Element = getByText('value1');
    const col2Element = getByText('value2');
    const col3Element = getByText('value3');

    // Then
    expect(colsElements).toHaveLength(3);
    expect(col1Element).toBeInTheDocument();
    expect(colsElements.item(0)).toBe(col1Element);
    expect(col2Element).toBeInTheDocument();
    expect(colsElements.item(1)).toBe(col2Element);
    expect(col3Element).toBeInTheDocument();
    expect(colsElements.item(2)).toBe(col3Element);
  });

  it('should render accessor column value', () => {
    // Given
    const getValueColumnsMock = [
      {
        getValue: (row: unknown) => {
          const { firstname, lastname } = row as { firstname: string; lastname: string };
          return `${lastname} ${firstname}`;
        },
        label: 'full-name-mock',
      },
    ];
    const getValueDataMock = {
      firstname: 'John',
      lastname: 'Doe',
    };

    // When
    const { getByText } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={getValueColumnsMock}
        data={getValueDataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );
    const col1Element = getByText('Doe John');

    // Then
    expect(col1Element).toBeInTheDocument();
  });

  it('should render formatted column value', () => {
    // Given
    const formatColumnsMock = [
      {
        format: (value: unknown) => `formatted-${value}`,
        key: 'column1',
        label: 'column-mock-1',
      },
    ];

    // When
    const { getByText } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={formatColumnsMock}
        data={dataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );
    const col1Element = getByText('formatted-value1');

    // Then
    expect(col1Element).toBeInTheDocument();
  });

  it('should be multiline element if columns multiline is defined', () => {
    // When
    const { getByText } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={columnsMock}
        data={dataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );
    const col2Element = getByText('value2');

    // Then
    expect(col2Element).toHaveClass('fr-cell--multiline');
  });

  it('should apply className on column cell if className is defined', () => {
    // Given
    const columnsWithClassNameMock = [
      {
        className: 'column-classname-mock',
        key: 'column1',
        label: 'column-mock-1',
      },
      {
        key: 'column2',
        label: 'column-mock-2',
      },
    ];

    // When
    const { getByText } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={columnsWithClassNameMock}
        data={dataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );
    const col1Element = getByText('value1');
    const col2Element = getByText('value2');

    // Then
    expect(col1Element).toHaveClass('column-classname-mock');
    expect(col2Element).not.toHaveClass('column-classname-mock');
  });

  it('should be N/A element if value is undefined', () => {
    // When
    const { getByText } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={[
          {
            key: 'column1',
            label: 'column-mock-1',
          },
          {
            getValue: () => undefined,
            label: 'column-mock-2',
            multiline: true,
          },
          {
            key: 'column3',
            label: 'column-mock-3',
          },
        ]}
        data={dataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );
    const col2Element = getByText('N/A');

    // Then
    expect(col2Element).toBeInTheDocument();
  });

  it('should render actions returned by actions renderer', () => {
    // Given
    const actionsMock = jest.fn(() => (
      <React.Fragment>
        <button type="button">action-1-mock</button>
        <button type="button">action-2-mock</button>
      </React.Fragment>
    ));

    // When
    const { getByText } = render(
      <TableRowComponent
        actions={actionsMock}
        className="any-classname-mock"
        columns={columnsMock}
        data={dataMock}
        index={0}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );

    // Then
    expect(actionsMock).toHaveBeenCalledExactlyOnceWith(dataMock, 0);
    expect(getByText('action-1-mock')).toBeInTheDocument();
    expect(getByText('action-2-mock')).toBeInTheDocument();
  });

  it('should render a selectable row with aria-selected and row select checkbox', () => {
    // Given
    const toggleOneItemMock = jest.fn();
    const selectableMock = {
      checkIfItemIsSelected: jest.fn().mockReturnValue(true),
      isAllItemsSelected: false,
      selection: new Set<string>(['itemIdKey-mock']),
      toggleAllItems: jest.fn(),
      toggleOneItem: toggleOneItemMock,
    };

    // When
    const { container } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={columnsMock}
        data={dataMock}
        index={0}
        selectable={selectableMock}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );

    // Then
    expect(container.firstChild).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('th.fr-cell--fixed')).toBeInTheDocument();
    expect(TableRowSelectComponent).toHaveBeenCalledExactlyOnceWith(
      {
        checked: true,
        id: 'any-table-id-mock--row-1--row-select',
        label: 'DSFR.table.columnSelect.row',
        onChange: expect.any(Function),
      },
      undefined,
    );
  });

  it('should set aria-selected to false when selectable row is not checked', () => {
    // Given
    const selectableMock = {
      checkIfItemIsSelected: jest.fn().mockReturnValue(false),
      isAllItemsSelected: false,
      selection: new Set<string>(),
      toggleAllItems: jest.fn(),
      toggleOneItem: jest.fn(),
    };

    // When
    const { container } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={columnsMock}
        data={dataMock}
        index={0}
        selectable={selectableMock}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );

    // Then
    expect(container.firstChild).toHaveAttribute('aria-selected', 'false');
  });

  it('should call toggleOneItem when row select checkbox changes', () => {
    // Given
    const toggleOneItemMock = jest.fn();
    const selectableMock = {
      checkIfItemIsSelected: jest.fn().mockReturnValue(false),
      isAllItemsSelected: false,
      selection: new Set<string>(),
      toggleAllItems: jest.fn(),
      toggleOneItem: toggleOneItemMock,
    };

    jest.mocked(TableRowSelectComponent).mockImplementation(({ onChange }) => (
      <button type="button" onClick={() => onChange(true)}>
        toggle-row-select
      </button>
    ));

    // When
    const { getByText } = render(
      <TableRowComponent
        className="any-classname-mock"
        columns={columnsMock}
        data={dataMock}
        index={0}
        selectable={selectableMock}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(tbody) },
    );

    fireEvent.click(getByText('toggle-row-select'));

    // Then
    expect(toggleOneItemMock).toHaveBeenCalledExactlyOnceWith(dataMock, true);
  });
});
