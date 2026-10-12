import { render } from '@testing-library/react';

import { TableHeaderComponent } from './table-header.component';

describe('TableHeaderComponent', () => {
  // Given
  const table = document.createElement('table');
  const selectableMock = {
    checkIfItemIsSelected: jest.fn(),
    isAllItemsSelected: false,
    selection: new Set<string>(),
    toggleAllItems: jest.fn(),
    toggleOneItem: jest.fn(),
  };
  const columnsMock = [
    {
      key: 'column1',
      label: 'column-mock-1',
    },
    {
      key: 'column2',
      label: 'column-mock-2',
    },
    {
      key: 'column3',
      label: 'column-mock-3',
    },
  ];

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <TableHeaderComponent
        className="any-classname-mock"
        columns={columnsMock}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(table) },
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with showActionsColumn true', () => {
    // When
    const { container, getByText } = render(
      <TableHeaderComponent
        showActionsColumn
        className="any-classname-mock"
        columns={columnsMock}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(table) },
    );
    const thElements = container.querySelectorAll('th');
    const colActionsElement = getByText('DSFR.table.columnActions.label');

    // Then
    expect(container).toMatchSnapshot();
    expect(thElements.item(3)).toBe(colActionsElement);
  });

  it('should render a select column with sr-only label when selectable is provided', () => {
    // When
    const { container, getByText } = render(
      <TableHeaderComponent
        className="any-classname-mock"
        columns={columnsMock}
        selectable={selectableMock}
        tableId="any-table-id-mock"
      />,
      { container: document.body.appendChild(table) },
    );
    const thElements = container.querySelectorAll('th');
    const selectColumnElement = getByText('DSFR.table.columnSelect.header');

    // Then
    expect(thElements).toHaveLength(4);
    expect(thElements.item(0)).toHaveClass('fr-cell--fixed');
    expect(selectColumnElement).toHaveClass('fr-sr-only');
  });
});
