import { renderHook } from '@testing-library/react';
import type { Location } from 'react-router';
import { useLoaderData, useLocation, useNavigate } from 'react-router';

import { useInstances } from './instances-page.hook';

describe('useInstances', () => {
  // Given
  const navigateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
    jest.mocked(useLocation).mockReturnValue({ state: {} } as Location);
    jest.mocked(useLoaderData).mockReturnValue({ payload: null });
  });

  it('should return hasItems as false when payload has no items', () => {
    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      closeAlertHandler: expect.any(Function),
      hasItems: false,
      items: null,
      submitState: undefined,
    });
  });

  it('should return hasItems as true when payload has items', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({
      payload: [expect.any(Object), expect.any(Object)],
    });

    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      closeAlertHandler: expect.any(Function),
      hasItems: true,
      items: [expect.any(Object), expect.any(Object)],
      submitState: undefined,
    });
  });

  it('should return params when submit state is defined', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      state: {
        submitState: {
          message: 'any-submitstate-message-mock',
          type: 'any-submitstate-type-mock',
        },
      },
    } as Location);

    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      closeAlertHandler: expect.any(Function),
      hasItems: false,
      items: null,
      submitState: {
        message: 'any-submitstate-message-mock',
        type: 'any-submitstate-type-mock',
      },
    });
  });

  it('should call navigate with params when user close the alert component', () => {
    // When
    const { result } = renderHook(() => useInstances());
    result.current.closeAlertHandler();

    // Then
    expect(navigateMock).toHaveBeenCalledOnce();
    expect(navigateMock).toHaveBeenCalledWith('.', { replace: false, state: undefined });
  });
});
