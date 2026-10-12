import { render } from '@testing-library/react';

import type { SelectableInterface } from '@fc/common';

import { SelectionTypes } from '../../../enums';
import { CheckboxComponent } from '../../checkbox';
import { TableSelectAllComponent } from './table-select-all.component';

jest.mock('../../checkbox/checkbox.component');

describe('TableSelectAllComponent', () => {
  // Given
  const toggleAllItemsMock = jest.fn();
  const selectableMock: SelectableInterface<{ id: string }> = {
    checkIfItemIsSelected: jest.fn(),
    isAllItemsSelected: false,
    selection: new Set(),
    toggleAllItems: toggleAllItemsMock,
    toggleOneItem: jest.fn(),
  };

  it('should call CheckboxComponent with select-all props', () => {
    // When
    render(
      <TableSelectAllComponent
        className="any-classname-mock"
        selectable={selectableMock}
        tableId="any-select-all-id-mock"
      />,
    );

    // Then
    expect(CheckboxComponent).toHaveBeenCalledExactlyOnceWith(
      {
        checked: false,
        id: 'any-select-all-id-mock--select-all',
        indeterminate: false,
        label: 'DSFR.table.selectAll.label',
        onChange: toggleAllItemsMock,
        selection: SelectionTypes.MULTIPLE,
      },
      undefined,
    );
  });

  it('should set indeterminate when selection is partial', () => {
    // Given
    const partialSelectableMock: SelectableInterface<{ id: string }> = {
      ...selectableMock,
      isAllItemsSelected: false,
      selection: new Set(['item-1']),
    };

    // When
    render(
      <TableSelectAllComponent
        selectable={partialSelectableMock}
        tableId="any-select-all-id-mock"
      />,
    );

    // Then
    expect(CheckboxComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        checked: false,
        indeterminate: true,
      }),
      undefined,
    );
  });

  it('should set checked when all items are selected', () => {
    // Given
    const allSelectedMock: SelectableInterface<{ id: string }> = {
      ...selectableMock,
      isAllItemsSelected: true,
      selection: new Set(['item-1', 'item-2']),
    };

    // When
    render(
      <TableSelectAllComponent selectable={allSelectedMock} tableId="any-select-all-id-mock" />,
    );

    // Then
    expect(CheckboxComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        checked: true,
        indeterminate: false,
      }),
      undefined,
    );
  });
});
