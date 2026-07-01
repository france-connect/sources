import { renderHook } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { MessageTypes } from '@fc/common';
import type { LocationWithSubmitStateInterface } from '@fc/core-partners';
import { useCleanupRouteState } from '@fc/routing';

import { useInstances } from './instances-page.hook';

describe('useInstances', () => {
  // Given
  const cleanupRouteStateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({ payload: [] });
    jest
      .mocked(useCleanupRouteState)
      .mockReturnValue({ cleanupRouteState: cleanupRouteStateMock, state: undefined });
  });

  it('should return hasItems as false when payload has no items', () => {
    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      cleanupRouteState: expect.any(Function),
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
      cleanupRouteState: expect.any(Function),
      hasItems: true,
      items: [instanceMock1, instanceMock2],
      submitState: undefined,
    });
  });

  it('should return params when submit state is defined', () => {
    // Given
    const submitStateMock = {
      message: 'any-submitstate-message-mock',
      title: 'any-submitstate-title-mock',
      type: MessageTypes.SUCCESS,
    } as unknown as LocationWithSubmitStateInterface;
    jest
      .mocked(useCleanupRouteState)
      .mockReturnValueOnce({ cleanupRouteState: cleanupRouteStateMock, state: submitStateMock });

    // When
    const { result } = renderHook(() => useInstances());

    // Then
    expect(result.current).toEqual({
      cleanupRouteState: expect.any(Function),
      hasItems: false,
      items: [],
      submitState: submitStateMock,
    });
  });
});
