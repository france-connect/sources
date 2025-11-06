import { renderHook } from '@testing-library/react';
import type { FormApi } from 'final-form';
import React from 'react';

import { useFormSubmit } from './form-submit.hook';

describe('useFormSubmit', () => {
  const onPreSubmitMock = jest.fn();
  const onPostSubmitMock = jest.fn();
  const onSubmitMock = jest.fn();
  const valuesMock = { some: 'values' };
  const preSubmitValuesMock = { some: 'preSubmitValues' };
  const errorsMock = [{ some: 'error' }];
  const formApiMock = Symbol('formApiMock') as unknown as FormApi;

  beforeEach(() => {
    jest.spyOn(React, 'useCallback').mockImplementation((fn) => fn);
  });

  it('should call onPreSubmit if provided', async () => {
    // Given
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    await result.current(valuesMock, formApiMock);

    // Then
    expect(onPreSubmitMock).toHaveBeenCalledExactlyOnceWith(valuesMock);
  });

  it('should call onSubmit with arg values if onPreSubmit is not provided', async () => {
    // Given
    const { result } = renderHook(() => useFormSubmit(onSubmitMock));

    // When
    await result.current(valuesMock, formApiMock);

    // Then
    expect(onSubmitMock).toHaveBeenCalledExactlyOnceWith(valuesMock, formApiMock);
  });

  it('should call onSubmit with values from onPreSubmit if provided', async () => {
    // Given
    onPreSubmitMock.mockResolvedValueOnce(preSubmitValuesMock);
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    await result.current(valuesMock, formApiMock);

    // Then
    expect(onSubmitMock).toHaveBeenCalledExactlyOnceWith(preSubmitValuesMock, formApiMock);
  });

  it('should not call on postSubmit if provided but onSubmit returned errors', async () => {
    // Given
    onSubmitMock.mockResolvedValueOnce(errorsMock);
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    await result.current(valuesMock, formApiMock);

    // Then
    expect(onPostSubmitMock).not.toHaveBeenCalled();
  });

  it('should call onPostSubmit if provided', async () => {
    // Given
    onPreSubmitMock.mockResolvedValueOnce(preSubmitValuesMock);
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    await result.current(valuesMock, formApiMock);

    // Then
    expect(onPostSubmitMock).toHaveBeenCalled();
    expect(onPostSubmitMock).toHaveBeenCalledExactlyOnceWith(preSubmitValuesMock, formApiMock);
  });

  it('should return error from onPostSubmit if provided', async () => {
    // Given
    const postSubmitErrorsMock = { some: 'postSubmitErrors' };
    onPostSubmitMock.mockResolvedValueOnce(postSubmitErrorsMock);
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    const errors = await result.current(valuesMock, formApiMock);

    // Then
    expect(errors).toBe(postSubmitErrorsMock);
  });
});
