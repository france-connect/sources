import { render } from '@testing-library/react';

import type { SelectableInterface } from '@fc/common';

import { Sizes } from '../../../enums';
import { TableToolbarComponent } from '../toolbar';
import { TableWrapperComponent } from './table-wrapper.component';

jest.mock('../toolbar/table-toolbar.component');

describe('TableWrapperComponent', () => {
  // Given
  const selectableMock: SelectableInterface<{ id: string }> = {
    checkIfItemIsSelected: jest.fn(),
    isAllItemsSelected: false,
    selection: new Set(),
    toggleAllItems: jest.fn(),
    toggleOneItem: jest.fn(),
  };

  it('should match the snapshot with required props', () => {
    // When
    const { container, getByRole } = render(<TableWrapperComponent id="any-table-id-mock" />);
    const tableElement = getByRole('table');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).not.toHaveClass('fr-table--bordered');
    expect(container.firstChild).not.toHaveClass('fr-table--no-scroll');
    expect(container.firstChild).toHaveAttribute('id', 'any-table-id-mock--wrapper');
    expect(tableElement).toBeInTheDocument();
    expect(tableElement).toHaveAttribute('id', 'any-table-id-mock--table');
    expect(TableToolbarComponent).not.toHaveBeenCalled();
  });

  it('should match the snapshot with optionnals props', () => {
    // When
    const { container, getByRole } = render(
      <TableWrapperComponent
        bordered
        multiline
        noScroll
        id="any-table-id-mock"
        size={Sizes.LARGE}
      />,
    );
    const tableElement = getByRole('table');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-table--bordered');
    expect(container.firstChild).toHaveClass('fr-table--multiline');
    expect(container.firstChild).toHaveClass('fr-table--no-scroll');
    expect(container.firstChild).toHaveAttribute('id', 'any-table-id-mock--wrapper');
    expect(tableElement).toBeInTheDocument();
    expect(tableElement).toHaveAttribute('id', 'any-table-id-mock--table');
  });

  it('should render toolbar when toolbar.selectAll is true', () => {
    // Given
    const toolbarMock = { selectAll: true };

    // When
    render(
      <TableWrapperComponent
        id="any-table-id-mock"
        selectable={selectableMock}
        toolbar={toolbarMock}
      />,
    );

    // Then
    expect(TableToolbarComponent).toHaveBeenCalledExactlyOnceWith(
      {
        selectable: selectableMock,
        tableId: 'any-table-id-mock',
        toolbar: toolbarMock,
      },
      undefined,
    );
  });

  it('should not render toolbar when toolbar is undefined', () => {
    // When
    render(<TableWrapperComponent id="any-table-id-mock" selectable={selectableMock} />);

    // Then
    expect(TableToolbarComponent).not.toHaveBeenCalled();
  });

  it('should not render toolbar when toolbar.selectAll defaults to false', () => {
    // When
    render(
      <TableWrapperComponent id="any-table-id-mock" selectable={selectableMock} toolbar={{}} />,
    );

    // Then
    expect(TableToolbarComponent).not.toHaveBeenCalled();
  });
});
