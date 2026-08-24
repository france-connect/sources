import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { TableRowComponent } from './table-row.component';

describe('TableRowComponent', () => {
  // Given
  const tbody = document.createElement('tbody');
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
  });

  it('should set the row id', () => {
    // when
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
    expect(container.firstChild).toHaveAttribute('id', 'any-table-id-mock--row-0');
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

  it('should not render actions cell if actions is not provided', () => {
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
    expect(container.querySelectorAll('td')).toHaveLength(3);
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

  it('should call action handler when clicking rendered action', () => {
    // Given
    const onActionClickMock = jest.fn();
    const actionsMock = () => (
      <button type="button" onClick={onActionClickMock}>
        action-mock
      </button>
    );

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
    fireEvent.click(getByText('action-mock'));

    // Then
    expect(onActionClickMock).toHaveBeenCalledOnce();
  });
});
