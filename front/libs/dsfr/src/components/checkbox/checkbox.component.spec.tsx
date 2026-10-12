import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';

import { SelectionTypes, Sizes } from '../../enums';
import { useCheckbox } from '../../hooks/checkbox/checkbox.hook';
import { CheckboxComponent } from './checkbox.component';

jest.mock('../../hooks/checkbox/checkbox.hook');

describe('CheckboxComponent', () => {
  // Given
  const onChangeMock = jest.fn();
  const handleChangeMock = jest.fn();
  const inputRefMock = createRef<HTMLInputElement>();

  const useCheckboxMock = {
    ariaChecked: undefined as boolean | 'mixed' | undefined,
    dataRowSelect: undefined as 'true' | undefined,
    handleChange: handleChangeMock,
    inputRef: inputRefMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useCheckbox).mockReturnValue(useCheckboxMock);
  });

  it('should match the snapshot with a label', () => {
    // When
    const { container } = render(
      <CheckboxComponent
        checked={false}
        id="checkbox-mock"
        label="Checkbox label mock"
        onChange={onChangeMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot without a label', () => {
    // When
    const { container } = render(
      <CheckboxComponent
        ariaLabel="Checkbox aria label mock"
        checked={false}
        id="checkbox-mock"
        onChange={onChangeMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useCheckbox with component props', () => {
    // When
    render(
      <CheckboxComponent
        indeterminate
        checked={false}
        id="checkbox-mock"
        label="Checkbox label mock"
        selection={SelectionTypes.MULTIPLE}
        onChange={onChangeMock}
      />,
    );

    // Then
    expect(useCheckbox).toHaveBeenCalledWith({
      checked: false,
      indeterminate: true,
      onChange: onChangeMock,
      rowSelect: false,
      selection: SelectionTypes.MULTIPLE,
    });
  });

  it('should render a single-selection checkbox with custom classNames', () => {
    // Given
    jest.mocked(useCheckbox).mockReturnValueOnce({
      ...useCheckboxMock,
    });

    // When
    const { container } = render(
      <CheckboxComponent
        checked
        classNames={{
          input: 'input-classname-mock',
          label: 'label-classname-mock',
        }}
        id="checkbox-mock"
        label="Checkbox label mock"
        selection={SelectionTypes.SINGLE}
        size={Sizes.SMALL}
        onChange={onChangeMock}
      />,
    );
    const inputElt = container.querySelector('input');
    const labelElt = container.querySelector('label');
    const groupElt = container.querySelector('.fr-checkbox-group');

    // Then
    expect(groupElt).toHaveClass('fr-checkbox-group--sm');
    expect(inputElt).toHaveClass('input-classname-mock');
    expect(inputElt).not.toHaveAttribute('aria-checked');
    expect(inputElt).not.toHaveAttribute('aria-label');
    expect(inputElt).toBeChecked();
    expect(labelElt).toHaveClass('fr-label', 'label-classname-mock');
    expect(labelElt).toHaveTextContent('Checkbox label mock');
  });

  it('should set aria-label when label is not provided', () => {
    // When
    const { container } = render(
      <CheckboxComponent
        ariaLabel="Sélectionner la ligne 1"
        checked={false}
        id="checkbox-mock"
        selection={SelectionTypes.SINGLE}
        onChange={onChangeMock}
      />,
    );
    const inputElt = container.querySelector('input');

    // Then
    expect(container.querySelector('label')).not.toBeInTheDocument();
    expect(inputElt).toHaveAttribute('aria-label', 'Sélectionner la ligne 1');
  });

  it('should render data-testid attributes when dataTestId is provided', () => {
    // When
    const { getByTestId } = render(
      <CheckboxComponent
        checked={false}
        dataTestId="checkbox-mock"
        id="checkbox-mock"
        label="Checkbox label mock"
        onChange={onChangeMock}
      />,
    );

    // Then
    expect(getByTestId('checkbox-mock')).toBeInTheDocument();
    expect(getByTestId('checkbox-mock--input')).toBeInTheDocument();
    expect(getByTestId('checkbox-mock--label')).toBeInTheDocument();
  });

  it('should render data-testid on input only when label is not provided', () => {
    // When
    const { getByTestId, queryByTestId } = render(
      <CheckboxComponent
        ariaLabel="Checkbox aria label mock"
        checked={false}
        dataTestId="checkbox-mock"
        id="checkbox-mock"
        onChange={onChangeMock}
      />,
    );

    // Then
    expect(getByTestId('checkbox-mock')).toBeInTheDocument();
    expect(getByTestId('checkbox-mock--input')).toBeInTheDocument();
    expect(queryByTestId('checkbox-mock--label')).not.toBeInTheDocument();
  });

  it('should call handleChange when checkbox value changes', () => {
    // When
    const { container } = render(
      <CheckboxComponent
        ariaLabel="Checkbox aria label mock"
        checked={false}
        id="checkbox-mock"
        onChange={onChangeMock}
      />,
    );
    const inputElt = container.querySelector('input');
    fireEvent.click(inputElt!);

    // Then
    expect(handleChangeMock).toHaveBeenCalledOnce();
  });

  it('should set data-fr-row-select to true when rowSelect is true', () => {
    // Given
    jest.mocked(useCheckbox).mockReturnValueOnce({
      ...useCheckboxMock,
      dataRowSelect: 'true',
    });

    // When
    const { container } = render(
      <CheckboxComponent
        rowSelect
        ariaLabel="Checkbox aria label mock"
        checked={false}
        id="checkbox-mock"
        onChange={onChangeMock}
      />,
    );
    const inputElt = container.querySelector('input');

    // Then
    expect(useCheckbox).toHaveBeenCalledWith(
      expect.objectContaining({
        rowSelect: true,
      }),
    );
    expect(inputElt).toHaveAttribute('data-fr-row-select', 'true');
  });

  describe('multiple selection', () => {
    it('should match the snapshot when indeterminate', () => {
      // Given
      jest.mocked(useCheckbox).mockReturnValueOnce({
        ...useCheckboxMock,
        ariaChecked: 'mixed',
        dataRowSelect: undefined,
      });

      // When
      const { container } = render(
        <CheckboxComponent
          indeterminate
          checked={false}
          id="checkbox-mock"
          label="Checkbox label mock"
          selection={SelectionTypes.MULTIPLE}
          onChange={onChangeMock}
        />,
      );

      // Then
      expect(container).toMatchSnapshot();
    });

    it('should set aria-checked to mixed when indeterminate', () => {
      // Given
      jest.mocked(useCheckbox).mockReturnValueOnce({
        ...useCheckboxMock,
        ariaChecked: 'mixed',
        dataRowSelect: undefined,
      });

      // When
      const { container } = render(
        <CheckboxComponent
          indeterminate
          checked={false}
          id="checkbox-mock"
          label="Checkbox label mock"
          selection={SelectionTypes.MULTIPLE}
          onChange={onChangeMock}
        />,
      );
      const inputElt = container.querySelector('input');

      // Then
      expect(inputElt).toHaveAttribute('aria-checked', 'mixed');
    });

    it('should set aria-checked to checked when not indeterminate', () => {
      // Given
      jest.mocked(useCheckbox).mockReturnValueOnce({
        ...useCheckboxMock,
        ariaChecked: true,
        dataRowSelect: undefined,
      });

      // When
      const { container } = render(
        <CheckboxComponent
          checked
          id="checkbox-mock"
          label="Checkbox label mock"
          selection={SelectionTypes.MULTIPLE}
          onChange={onChangeMock}
        />,
      );
      const inputElt = container.querySelector('input');

      // Then
      expect(inputElt).toHaveAttribute('aria-checked', 'true');
    });

    it('should not set aria-checked when selection is not multiple', () => {
      // When
      const { container } = render(
        <CheckboxComponent
          indeterminate
          ariaLabel="Checkbox aria label mock"
          checked={false}
          id="checkbox-mock"
          onChange={onChangeMock}
        />,
      );
      const inputElt = container.querySelector('input');

      // Then
      expect(inputElt).not.toHaveAttribute('aria-checked');
    });
  });
});
