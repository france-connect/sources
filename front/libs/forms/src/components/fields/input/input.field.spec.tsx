import { render } from '@testing-library/react';
import { Field } from 'react-final-form';

import { useClipboard } from '@fc/common';

import { FieldTypes } from '../../../enums';
import { TextAreaInput, TextInput } from '../../inputs';
import { InputField } from './input.field';

describe('InputField', () => {
  beforeEach(() => {
    jest.mocked(Field).mockImplementation(jest.fn());
  });

  it('should match snapshot and render a text input', () => {
    // Given
    const formatMock = jest.fn();
    const onPasteMock = jest.fn();
    const validateMock = jest.fn();
    jest
      .mocked(useClipboard)
      .mockReturnValueOnce({ onCopy: jest.fn(), onPaste: onPasteMock, value: expect.anything() });

    // When
    const { container } = render(
      <InputField
        config={{
          clipboardDisabled: true,
          format: formatMock,
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
        }}
        type={FieldTypes.TEXT}
        validate={validateMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useClipboard).toHaveBeenCalledOnce();
    expect(useClipboard).toHaveBeenCalledWith(true);
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      {
        component: TextInput,
        config: {
          label: 'any-label-mock',
          required: true,
        },
        format: formatMock,
        name: 'any-name-mock',
        onPaste: onPasteMock,
        subscription: { error: true, touched: true, value: true },
        type: FieldTypes.TEXT,
        validate: validateMock,
      },
      {},
    );
  });

  it('should match snapshot and render a text area', () => {
    // Given
    const formatMock = jest.fn();
    const onPasteMock = jest.fn();
    const validateMock = jest.fn();
    jest
      .mocked(useClipboard)
      .mockReturnValueOnce({ onCopy: jest.fn(), onPaste: onPasteMock, value: expect.anything() });

    // When
    const { container } = render(
      <InputField
        config={{
          clipboardDisabled: true,
          format: formatMock,
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
        }}
        type={FieldTypes.TEXTAREA}
        validate={validateMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useClipboard).toHaveBeenCalledOnce();
    expect(useClipboard).toHaveBeenCalledWith(true);
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      {
        component: TextAreaInput,
        config: {
          label: 'any-label-mock',
          required: true,
        },
        format: formatMock,
        name: 'any-name-mock',
        onPaste: onPasteMock,
        subscription: { error: true, touched: true, value: true },
        type: FieldTypes.TEXTAREA,
        validate: validateMock,
      },
      {},
    );
  });
});
