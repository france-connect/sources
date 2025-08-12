import { useField } from 'react-final-form';

import { renderWithFinalForm } from '@fc/testing-library';

import { TextAreaInputComponent } from './text-area-input.component';

describe('TextAreaInputComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useField).mockReturnValue({
      input: {
        name: 'text-area',
        onBlur: jest.fn(),
        onChange: jest.fn(),
        onFocus: jest.fn(),
        value: 'mock-value',
      },
      meta: { error: false, touched: true },
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = renderWithFinalForm(<TextAreaInputComponent label="label" name="name" />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with info', () => {
    // When
    const { container } = renderWithFinalForm(
      <TextAreaInputComponent info="info" label="label" name="name" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with maxLength', () => {
    // When
    const { container } = renderWithFinalForm(
      <TextAreaInputComponent info="info" label="label" maxLength={100} name="name" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have called useField', () => {
    renderWithFinalForm(
      <TextAreaInputComponent description="description" label="label" name="name" />,
    );

    // Then
    expect(useField).toHaveBeenCalledOnce();
    expect(useField).toHaveBeenCalledWith('name', {
      subscription: { value: true },
    });
  });
});
