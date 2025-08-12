import { useField } from 'react-final-form';

import { composeValidators } from '@fc/core-user-dashboard';
import { renderWithFinalForm } from '@fc/testing-library';

import { TextInputComponent } from './text-input.component';

describe('TextInputComponent', () => {
  const formatValidator = jest.fn();
  const validatorsMock = [formatValidator];

  beforeEach(() => {
    // Given
    jest.mocked(useField).mockReturnValue({
      input: expect.any(Object),
      meta: { error: false, touched: true },
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = renderWithFinalForm(
      <TextInputComponent
        description="description"
        label="label"
        name="name"
        validators={validatorsMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with validation error', () => {
    // Given
    jest.mocked(useField).mockReturnValueOnce({
      input: expect.any(Object),
      meta: { error: 'error', touched: true },
    });

    // When
    const { container } = renderWithFinalForm(
      <TextInputComponent
        description="description"
        label="label"
        name="name"
        validators={validatorsMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with info', () => {
    // When
    const { container } = renderWithFinalForm(
      <TextInputComponent
        description="description"
        info="info"
        label="label"
        name="name"
        validators={validatorsMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should be required', () => {
    // Given
    const { getByText } = renderWithFinalForm(
      <TextInputComponent
        description="description"
        label="label"
        name="name"
        validators={validatorsMock}
      />,
    );

    // When
    const element = getByText('label*');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should not be required', () => {
    // Given
    const { queryByText } = renderWithFinalForm(
      <TextInputComponent
        description="description"
        label="label"
        name="name"
        required={false}
        validators={validatorsMock}
      />,
    );

    // When / Then
    expect(queryByText('label*')).not.toBeInTheDocument();
  });

  it('should have called composeValidators', () => {
    // When
    renderWithFinalForm(
      <TextInputComponent
        description="description"
        label="label"
        name="name"
        validators={validatorsMock}
      />,
    );

    // Then
    expect(composeValidators).toHaveBeenCalledOnce();
    expect(composeValidators).toHaveBeenCalledWith(formatValidator);
  });

  it('should have called useField', () => {
    // When
    renderWithFinalForm(
      <TextInputComponent
        description="description"
        label="label"
        name="name"
        validators={validatorsMock}
      />,
    );

    // Then
    expect(useField).toHaveBeenCalledOnce();
    expect(useField).toHaveBeenCalledWith('name', {
      subscription: { error: true, touched: true },
    });
  });
});
