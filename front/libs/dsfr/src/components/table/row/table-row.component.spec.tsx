import { render } from '@testing-library/react';

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
});
