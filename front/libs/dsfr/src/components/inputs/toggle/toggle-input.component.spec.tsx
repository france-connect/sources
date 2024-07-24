import { fireEvent, render } from '@testing-library/react';
import type { FieldInputProps } from 'react-final-form';

import { ToggleInputComponent } from './toggle-input.component';

describe('ToggleInputComponent', () => {
  // Given
  const fieldInputPropsMock = {
    name: 'any-field-name-mock',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    value: 'any-field-value-mock',
  } as FieldInputProps<unknown, HTMLElement>;

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ToggleInputComponent input={fieldInputPropsMock} />);

    // Then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with disabled props to true', () => {
    // When
    const { container } = render(<ToggleInputComponent disabled input={fieldInputPropsMock} />);

    // Then
    expect(container.firstChild).toHaveProperty('disabled', true);
  });

  it('should call onUpdate when input change', () => {
    // Given
    const onUpdateMock = jest.fn();

    // When
    const { getByTestId } = render(
      <ToggleInputComponent disabled input={fieldInputPropsMock} onUpdate={onUpdateMock} />,
    );
    const inputElement = getByTestId('field-toggle-input-any-field-name-mock');
    fireEvent.click(inputElement);

    // Then
    expect(onUpdateMock).toHaveBeenCalled();
  });
});
