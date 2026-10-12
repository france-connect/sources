import { render } from '@testing-library/react';

import type { SelectableInterface } from '@fc/common';

import { TableSelectAllComponent } from '../select-all';
import { TableToolbarComponent } from './table-toolbar.component';

jest.mock('../select-all/table-select-all.component');

describe('TableToolbarComponent', () => {
  // Given
  const selectableMock: SelectableInterface<{ id: string }> = {
    checkIfItemIsSelected: jest.fn(),
    isAllItemsSelected: false,
    selection: new Set(),
    toggleAllItems: jest.fn(),
    toggleOneItem: jest.fn(),
  };

  it('should not render select-all when toolbar.selectAll is not enabled', () => {
    // When
    const { container } = render(
      <TableToolbarComponent
        selectable={selectableMock}
        tableId="any-table-id-mock"
        toolbar={{}}
      />,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-table__header');
    expect(TableSelectAllComponent).not.toHaveBeenCalled();
  });

  it('should match the snapshot with selectAll', () => {
    // When
    const { container } = render(
      <TableToolbarComponent
        className="any-classname-mock"
        selectable={selectableMock}
        tableId="any-table-id-mock"
        toolbar={{ selectAll: true }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-table__header');
    expect(container.firstChild).toHaveClass('any-classname-mock');
    expect(TableSelectAllComponent).toHaveBeenCalledExactlyOnceWith(
      {
        selectable: selectableMock,
        tableId: 'any-table-id-mock',
      },
      undefined,
    );
  });

  it('should render children without selectAll', () => {
    // When
    const { container, getByText } = render(
      <TableToolbarComponent tableId="any-table-id-mock" toolbar={{}}>
        <p>toolbar-children-mock</p>
      </TableToolbarComponent>,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-table__header');
    expect(getByText('toolbar-children-mock')).toBeInTheDocument();
    expect(TableSelectAllComponent).not.toHaveBeenCalled();
  });
});
