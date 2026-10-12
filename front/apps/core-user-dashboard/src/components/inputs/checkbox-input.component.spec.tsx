import { Field, useField } from 'react-final-form';

import { renderWithFinalForm } from '@fc/testing-library';

import { CheckboxInputComponent } from './checkbox-input.component';

describe('CheckboxInputComponent', () => {
  // Given
  const validateMock = jest.fn();
  const inputMock = {
    checked: false,
    name: 'any-name-mock',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    type: 'checkbox',
    value: false,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useField).mockReturnValue({
      input: expect.any(Object),
      meta: { error: false, touched: true },
    });
    jest.mocked(Field).mockImplementation(({ children }) => {
      if (typeof children !== 'function') {
        return null;
      }

      return children({
        input: inputMock,
        meta: {},
      }) as React.ReactElement;
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = renderWithFinalForm(
      <CheckboxInputComponent
        label="any-label-mock"
        name="any-name-mock"
        validate={validateMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with validation error', () => {
    // Given
    jest.mocked(useField).mockReturnValueOnce({
      input: expect.any(Object),
      meta: { error: 'any-error-mock', touched: true },
    });

    // When
    const { container } = renderWithFinalForm(
      <CheckboxInputComponent
        label="any-label-mock"
        name="any-name-mock"
        validate={validateMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have called useField', () => {
    // When
    renderWithFinalForm(
      <CheckboxInputComponent
        label="any-label-mock"
        name="any-name-mock"
        validate={validateMock}
      />,
    );

    // Then
    expect(useField).toHaveBeenCalledExactlyOnceWith('any-name-mock', {
      subscription: { error: true, touched: true },
    });
  });

  it('should have called Field with correct props', () => {
    // When
    renderWithFinalForm(
      <CheckboxInputComponent
        label="any-label-mock"
        name="any-name-mock"
        validate={validateMock}
      />,
    );

    // Then
    expect(Field).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Function),
        name: 'any-name-mock',
        type: 'checkbox',
        validate: validateMock,
      },
      undefined,
    );
  });

  it('should render the label', () => {
    // When
    const { getByTestId } = renderWithFinalForm(
      <CheckboxInputComponent
        label="any-label-mock"
        name="any-name-mock"
        validate={validateMock}
      />,
    );
    const labelElt = getByTestId('field-checkbox-label');

    // Then
    expect(labelElt).toBeInTheDocument();
    expect(labelElt).toHaveTextContent('any-label-mock');
    expect(labelElt).toHaveAttribute('for', 'any-name-mock');
  });

  it('should apply error class and message when touched and has error', () => {
    // Given
    jest.mocked(useField).mockReturnValueOnce({
      input: expect.any(Object),
      meta: { error: 'any-error-mock', touched: true },
    });

    // When
    const { container, getByText } = renderWithFinalForm(
      <CheckboxInputComponent
        label="any-label-mock"
        name="any-name-mock"
        validate={validateMock}
      />,
    );
    const errorElt = getByText('any-error-mock');

    // Then
    expect(container.firstChild?.firstChild).toHaveClass('fr-checkbox-group--error');
    expect(errorElt).toBeInTheDocument();
    expect(errorElt).toHaveAttribute('id', 'any-name-mock-error-desc');
  });

  it('should not display error when field is not touched', () => {
    // Given
    jest.mocked(useField).mockReturnValueOnce({
      input: expect.any(Object),
      meta: { error: 'any-error-mock', touched: false },
    });

    // When
    const { container, queryByText } = renderWithFinalForm(
      <CheckboxInputComponent
        label="any-label-mock"
        name="any-name-mock"
        validate={validateMock}
      />,
    );

    // Then
    expect(container.firstChild?.firstChild).not.toHaveClass('fr-checkbox-group--error');
    expect(queryByText('any-error-mock')).not.toBeInTheDocument();
  });
});
