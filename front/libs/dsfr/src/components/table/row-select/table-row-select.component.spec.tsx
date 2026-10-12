import { render } from '@testing-library/react';

import { Sizes } from '../../../enums';
import { CheckboxComponent } from '../../checkbox';
import { TableRowSelectComponent } from './table-row-select.component';

jest.mock('../../checkbox/checkbox.component');

describe('TableRowSelectComponent', () => {
  // Given
  const onChangeMock = jest.fn();

  it('should call CheckboxComponent with DSFR row select props', () => {
    // When
    render(
      <TableRowSelectComponent
        checked
        id="any-row-select-id-mock"
        label="Sélectionner la ligne 1"
        onChange={onChangeMock}
      />,
    );

    // Then
    expect(CheckboxComponent).toHaveBeenCalledExactlyOnceWith(
      {
        checked: true,
        dataTestId: 'any-row-select-id-mock-row-select',
        disabled: false,
        id: 'any-row-select-id-mock',
        label: 'Sélectionner la ligne 1',
        onChange: onChangeMock,
        rowSelect: true,
        size: Sizes.SMALL,
      },
      undefined,
    );
  });

  it('should pass disabled to CheckboxComponent', () => {
    // When
    render(
      <TableRowSelectComponent
        disabled
        checked={false}
        id="any-row-select-id-mock"
        label="Sélectionner la ligne 1"
        onChange={onChangeMock}
      />,
    );

    // Then
    expect(CheckboxComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        disabled: true,
      }),
      undefined,
    );
  });
});
