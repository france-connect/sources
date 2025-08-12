import { renderHook } from '@testing-library/react';
import { useCallback } from 'react';

import { useFormSubmit } from './form-submit.hook';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(),
}));

describe('useFormSubmit', () => {
  const useCallbackMock = jest.mocked(useCallback);

  const onPreSubmitMock = jest.fn();
  const onPostSubmitMock = jest.fn();
  const onSubmitMock = jest.fn();
  const valuesMock = { some: 'values' };
  const preSubmitValuesMock = { some: 'preSubmitValues' };
  const errorsMock = [{ some: 'error' }];

  beforeEach(() => {
    jest.resetAllMocks();
    useCallbackMock.mockImplementation((fn) => fn);
  });

  it('should call onPreSubmit if provided', async () => {
    // Given
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    await result.current(valuesMock);

    // Then
    expect(onPreSubmitMock).toHaveBeenCalledExactlyOnceWith(valuesMock);
  });

  it('should call onSubmit with arg values if onPreSubmit is not provided', async () => {
    // Given
    const { result } = renderHook(() => useFormSubmit(onSubmitMock));

    // When
    await result.current(valuesMock);

    // Then
    expect(onSubmitMock).toHaveBeenCalledExactlyOnceWith(valuesMock);
  });

  it('should call onSubmit with values from onPreSubmit if provided', async () => {
    // Given
    onPreSubmitMock.mockResolvedValueOnce(preSubmitValuesMock);
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    await result.current(valuesMock);

    // Then
    expect(onSubmitMock).toHaveBeenCalledExactlyOnceWith(preSubmitValuesMock);
  });

  it('should not call on postSubmit if provided but onSubmit returned errors', async () => {
    // Given
    onSubmitMock.mockResolvedValueOnce(errorsMock);
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    await result.current(valuesMock);

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
    await result.current(valuesMock);

    // Then
    expect(onPostSubmitMock).toHaveBeenCalled();
    expect(onPostSubmitMock).toHaveBeenCalledExactlyOnceWith(preSubmitValuesMock);
  });

  it('should return error from onPostSubmit if provided', async () => {
    // Given
    const postSubmitErrorsMock = { some: 'postSubmitErrors' };
    onPostSubmitMock.mockResolvedValueOnce(postSubmitErrorsMock);
    const { result } = renderHook(() =>
      useFormSubmit(onSubmitMock, onPreSubmitMock, onPostSubmitMock),
    );

    // When
    const errors = await result.current(valuesMock);

    // Then
    expect(errors).toBe(postSubmitErrorsMock);
  });
});
