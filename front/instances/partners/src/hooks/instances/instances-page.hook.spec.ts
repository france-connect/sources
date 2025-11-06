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
    jest.mocked(useLoaderData).mockReturnValue({ payload: [] });
  });

  it('should return hasItems as false when payload has no items', () => {
    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      closeAlertHandler: expect.any(Function),
      hasItems: false,
      items: [],
      submitState: undefined,
    });
  });

  it('should return hasItems as true when payload has items', () => {
    // Given
    const instanceMock1 = {
      createdAt: 'any-createdAt-mock1',
      id: 'any-id-mock1',
      updatedAt: 'any-updatedAt-mock1',
      versions: [
        {
          data: {
            name: 'any-name-mock1',
          },
        },
      ],
    };
    const instanceMock2 = {
      createdAt: 'any-createdAt-mock1',
      id: 'any-id-mock2',
      updatedAt: 'any-updatedAt-mock2',
      versions: [
        {
          data: {
            name: 'any-name-mock2',
          },
        },
      ],
    };
    jest.mocked(useLoaderData).mockReturnValueOnce({
      payload: [instanceMock1, instanceMock2],
    });

    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      closeAlertHandler: expect.any(Function),
      hasItems: true,
      items: [instanceMock1, instanceMock2],
      submitState: undefined,
    });
  });

  it('should return params when submit state is defined', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      state: {
        submitState: {
          message: 'any-submitstate-message-mock',
          type: 'any-message-type-mock',
        },
      },
    } as Location);

    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      closeAlertHandler: expect.any(Function),
      hasItems: false,
      items: [],
      submitState: {
        message: 'any-submitstate-message-mock',
        type: 'any-message-type-mock',
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
