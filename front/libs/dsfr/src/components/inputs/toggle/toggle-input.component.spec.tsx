import { render } from '@testing-library/react';
import { FieldInputProps } from 'react-final-form';

import { ToggleInputComponent } from './toggle-input.component';

describe('ToggleInputComponent', () => {
  const fieldInputPropsMock = {
    name: 'any-field-name-mock',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    value: 'any-field-value-mock',
  } as FieldInputProps<unknown, HTMLElement>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ToggleInputComponent input={fieldInputPropsMock} />);

    // Then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with disabled props to true', () => {
    // given
    const disabled = true;

    // When
    const { container } = render(
      <ToggleInputComponent disabled={disabled} input={fieldInputPropsMock} />,
    );

    // Then
    expect(container.firstChild).toHaveProperty('disabled', true);
  });
});
