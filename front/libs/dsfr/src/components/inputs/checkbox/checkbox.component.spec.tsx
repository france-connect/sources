import { render } from '@testing-library/react';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  // Given
  const fieldInputPropsMock = {
    name: 'any-field-name-mock',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    value: 'any-field-value-mock',
  };

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have render the label', () => {
    // When
    const { getByText } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByText('any-label-mock');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should have render the hint', () => {
    // When
    const { getByText } = render(
      <CheckboxComponent hint="any-hint-mock" input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByText('any-hint-mock');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should have render the error', () => {
    // When
    const { getByText } = render(
      <CheckboxComponent
        error="any-error-mock"
        input={fieldInputPropsMock}
        label="any-label-mock"
      />,
    );
    const element = getByText('any-error-mock');

    // Then
    expect(element).toBeInTheDocument();
  });

  it("should have set the input's name attribute", () => {
    // When
    const { getByTestId } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-input');

    // Then
    expect(element).toHaveAttribute('id', fieldInputPropsMock.name);
  });

  it("should have set the label's htmlfor attribute related to the input's id", () => {
    // When
    const { getByTestId } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-label');

    // Then
    expect(element).toHaveAttribute('for', fieldInputPropsMock.name);
  });

  it("should have set the input's disabled attribute", () => {
    // When
    const { getByTestId } = render(
      <CheckboxComponent disabled input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-input');

    // Then
    expect(element).toHaveAttribute('disabled');
  });

  it("should not have set the input's disabled attribute", () => {
    // When
    const { getByTestId } = render(
      <CheckboxComponent disabled={false} input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-input');

    // Then
    expect(element).not.toHaveAttribute('disabled');
  });
});
