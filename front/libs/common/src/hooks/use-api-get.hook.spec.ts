import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

import { get } from '@fc/http-client';

import { useApiGet } from './use-api-get.hook';

describe('useApiGet', () => {
  // Given
  const navigateMock = jest.fn();

  beforeEach(() => {
    // Given
    const response = { data: 'any-data-response' } as unknown as AxiosResponse;
    jest.mocked(get).mockResolvedValue(response);
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  it('should have return default state at first render', async () => {
    // Given
    const response = undefined as unknown as AxiosResponse;
    jest.mocked(get).mockResolvedValueOnce(response);

    // When
    const { result } = renderHook(() => useApiGet({ endpoint: 'any-url' }));

    // Then
    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('should have called get at first render only', async () => {
    // When
    const { rerender, result } = renderHook(() => useApiGet({ endpoint: 'any-url' }));
    // @NOTE excessive renders only for tests purpose
    rerender();
    rerender();
    rerender();
    rerender();

    // Then
    await waitFor(() => {
      expect(get).toHaveBeenCalledOnce();
      expect(get).toHaveBeenCalledWith('any-url');
      expect(result.current).toBe('any-data-response');
    });
  });

  it('should have called optional callback with api response', async () => {
    // Given
    const callbackMock = jest.fn();

    // When
    renderHook(() => useApiGet({ endpoint: 'any-url' }, callbackMock));

    // Then
    await waitFor(() => {
      expect(callbackMock).toHaveBeenCalledOnce();
      expect(callbackMock).toHaveBeenCalledWith('any-data-response');
    });
  });

  it('should navigate if an error is thrown and errorPath is provided', async () => {
    // Given
    jest.mocked(get).mockRejectedValueOnce(new Error('any-error'));
    const callbackMock = jest.fn();

    // When
    renderHook(() => useApiGet({ endpoint: 'any-url', errorPath: '/some/path' }, callbackMock));

    // Then
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledOnce();
      expect(navigateMock).toHaveBeenCalledWith('/some/path', { replace: true });
    });
  });

  it('should NOT navigate if an error is thrown but errorPath is not provided', async () => {
    // Given
    jest.mocked(get).mockRejectedValueOnce(new Error('any-error'));
    const callbackMock = jest.fn();

    // When
    renderHook(() => useApiGet({ endpoint: 'any-url' }, callbackMock));

    // Then
    await waitFor(() => {
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it('should NOT use callback if an error is thrown', async () => {
    // Given
    jest.mocked(get).mockRejectedValueOnce(new Error('any-error'));
    const callbackMock = jest.fn();

    // When
    renderHook(() => useApiGet({ endpoint: 'any-url' }, callbackMock));

    // Then
    await waitFor(() => {
      expect(callbackMock).not.toHaveBeenCalled();
    });
  });
});
