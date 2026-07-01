import { renderHook } from '@testing-library/react';
import type { Location } from 'react-router';
import { useLocation, useNavigate } from 'react-router';

import { RoutePaths } from '../../enums';
import { useCleanupRouteState } from './cleanup-route-state.hook';

describe('useCleanupRouteState', () => {
  // Given
  const navigateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  it('should call useNavigate', () => {
    // When
    renderHook(() => useCleanupRouteState());

    // Then
    expect(useNavigate).toHaveBeenCalledOnce();
  });

  it('should call useLocation', () => {
    // When
    renderHook(() => useCleanupRouteState());

    // Then
    expect(useLocation).toHaveBeenCalledOnce();
  });

  it('should call navigate to clear the route state', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      state: { some: 'state' },
    } as unknown as Location);

    // When
    const { result } = renderHook(() => useCleanupRouteState());
    result.current.cleanupRouteState();

    // Then
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.CURRENT, {
      replace: false,
      state: undefined,
    });
  });

  it('should not call navigate to clear the route state if the state is not defined', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      state: undefined,
    } as unknown as Location);

    // When
    const { result } = renderHook(() => useCleanupRouteState());
    result.current.cleanupRouteState();

    // Then
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('should call navigate again when location changes', () => {
    // Given
    jest.mocked(useLocation).mockReturnValueOnce({
      pathname: '/new-path',
      state: { some: 'state' },
    } as unknown as Location);

    const { rerender, result } = renderHook(() => useCleanupRouteState());
    navigateMock.mockClear();

    jest.mocked(useLocation).mockReturnValueOnce({
      pathname: '/new-path',
      state: { updated: 'state' },
    } as unknown as Location);

    // When
    rerender();
    result.current.cleanupRouteState();

    // Then
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.CURRENT, {
      replace: false,
      state: undefined,
    });
  });
});
