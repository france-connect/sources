import { renderHook } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import type { FieldMessage, FormConfigInterface } from '../../interfaces';
import { useFieldMessages } from './field-messages.hook';

describe('useFieldMessages', () => {
  const messageMock1 = Symbol('messagesMock1') as unknown as FieldMessage;
  const messageMock2 = Symbol('messagesMock2') as unknown as FieldMessage;

  const errorMessageMock1 = Symbol('errorMessageMock1') as unknown as FieldMessage;

  const errorMessageMock2 = Symbol('errorMessageMock2') as unknown as FieldMessage;

  const validMessageMock = {
    content: 'Form.message.valid',
    level: 'valid',
    priority: 30,
  };

  const configMock = { showFieldValidationMessage: true } as FormConfigInterface;

  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue(configMock);
  });

  it('should return empty list', () => {
    // When
    const { result } = renderHook(() => useFieldMessages({}));

    // Then
    expect(result.current).toStrictEqual([]);
  });

  it('should return messages', () => {
    // Given
    const messagesMock = [messageMock1, messageMock2];

    // When
    const { result } = renderHook(() =>
      useFieldMessages({
        messages: messagesMock,
      }),
    );

    // Then
    expect(result.current).toStrictEqual(messagesMock);
  });

  it('should return error messages', () => {
    // Given
    const errorsListMock = [errorMessageMock1, errorMessageMock2];

    // When
    const { result } = renderHook(() =>
      useFieldMessages({
        errorsList: errorsListMock,
      }),
    );

    // Then
    expect(result.current).toStrictEqual([errorMessageMock1, errorMessageMock2]);
  });

  it('should return valid message', () => {
    // When
    const { result } = renderHook(() =>
      useFieldMessages({
        isValid: true,
      }),
    );

    // Then
    expect(result.current).toStrictEqual([validMessageMock]);
  });

  it('should concatenate all messages', () => {
    // Given
    const messagesMock = [messageMock1, messageMock2];
    const errorsListMock = [errorMessageMock1, errorMessageMock2];

    // When
    const { result } = renderHook(() =>
      useFieldMessages({
        errorsList: errorsListMock,
        isValid: true,
        messages: messagesMock,
      }),
    );

    // Then
    expect(result.current).toStrictEqual([
      errorMessageMock1,
      errorMessageMock2,
      messageMock1,
      messageMock2,
      validMessageMock,
    ]);
  });
});
