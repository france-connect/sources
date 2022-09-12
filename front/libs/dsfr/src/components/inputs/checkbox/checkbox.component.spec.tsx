import { render } from '@testing-library/react';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  // given
  const fieldInputPropsMock = {
    name: 'any-field-name-mock',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    value: 'any-field-value-mock',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should have render the label', () => {
    // when
    const { getByText } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByText('any-label-mock');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render the hint', () => {
    // when
    const { getByText } = render(
      <CheckboxComponent hint="any-hint-mock" input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByText('any-hint-mock');

    // then
    expect(element).toBeInTheDocument();
  });

  it("should have set the input's name attribute", () => {
    // when
    const { getByTestId } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-input');

    // then
    expect(element).toHaveAttribute('id', fieldInputPropsMock.name);
  });

  it("should have set the label's htmlfor attribute related to the input's id", () => {
    // when
    const { getByTestId } = render(
      <CheckboxComponent input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-label');

    // then
    expect(element).toHaveAttribute('for', fieldInputPropsMock.name);
  });

  it("should have set the input's disabled attribute", () => {
    // when
    const { getByTestId } = render(
      <CheckboxComponent disabled input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-input');

    // then
    expect(element).toHaveAttribute('disabled');
  });

  it("should not have set the input's disabled attribute", () => {
    // when
    const { getByTestId } = render(
      <CheckboxComponent disabled={false} input={fieldInputPropsMock} label="any-label-mock" />,
    );
    const element = getByTestId('field-checkbox-input');

    // then
    expect(element).not.toHaveAttribute('disabled');
  });
});
