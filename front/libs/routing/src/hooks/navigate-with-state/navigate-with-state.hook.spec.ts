import { renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router';

import { MessageTypes } from '@fc/common';

import { RoutePaths } from '../../enums';
import type { LocationStateInterface } from '../../interfaces';
import { useNavigateWithState } from './navigate-with-state.hook';

describe('useNavigateWithState', () => {
  // Given
  const navigateMock = jest.fn();
  const pathMock = Symbol('path-mock') as unknown as string;
  const goBackStateMock = { title: 'any-title-mock' };
  const replaceMock = Symbol('replace-mock') as unknown as boolean;

  beforeEach(() => {
    // Given
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  it('should call useNavigate', () => {
    // When
    renderHook(() => useNavigateWithState());

    // Then
    expect(useNavigate).toHaveBeenCalledOnce();
  });

  it('should return navigateWithState, goBackWithSuccess and goBackWithError', () => {
    // When
    const { result } = renderHook(() => useNavigateWithState());

    // Then
    expect(result.current).toStrictEqual({
      goBack: expect.any(Function),
      goBackWithError: expect.any(Function),
      goBackWithSuccess: expect.any(Function),
      navigateWithState: expect.any(Function),
    });
  });

  describe('navigateWithState', () => {
    it('should navigate to defined path with replace and state', () => {
      // Given
      const { result } = renderHook(() => useNavigateWithState());
      const stateMock = Symbol('state-mock') as unknown as LocationStateInterface;

      // When
      result.current.navigateWithState(pathMock, stateMock, replaceMock);

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith(pathMock, {
        replace: replaceMock,
        state: stateMock,
      });
    });
  });

  describe('goBack', () => {
    it('should navigate to PREVIOUS with replace false by default', () => {
      // Given
      const { result } = renderHook(() => useNavigateWithState());

      // When
      result.current.goBack();

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.PREVIOUS, { replace: false });
    });

    it('should navigate to PREVIOUS with replace true when specified', () => {
      // Given
      const { result } = renderHook(() => useNavigateWithState());

      // When
      result.current.goBack(true);

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.PREVIOUS, { replace: true });
    });
  });

  describe('goBackWithSuccess', () => {
    it('should navigate to PREVIOUS with SUCCESS type and replace true by default', () => {
      // Given
      const { result } = renderHook(() => useNavigateWithState());

      // When
      result.current.goBackWithSuccess(goBackStateMock);

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.PREVIOUS, {
        replace: true,
        state: { ...goBackStateMock, type: MessageTypes.SUCCESS },
      });
    });

    it('should navigate with replace false when specified', () => {
      // Given
      const { result } = renderHook(() => useNavigateWithState());

      // When
      result.current.goBackWithSuccess(goBackStateMock, false);

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.PREVIOUS, {
        replace: false,
        state: { ...goBackStateMock, type: MessageTypes.SUCCESS },
      });
    });
  });

  describe('goBackWithError', () => {
    it('should navigate to PREVIOUS with ERROR type and replace true by default', () => {
      // Given
      const { result } = renderHook(() => useNavigateWithState());

      // When
      result.current.goBackWithError(goBackStateMock);

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.PREVIOUS, {
        replace: true,
        state: { ...goBackStateMock, type: MessageTypes.ERROR },
      });
    });

    it('should navigate with replace false when specified', () => {
      // Given
      const { result } = renderHook(() => useNavigateWithState());

      // When
      result.current.goBackWithError(goBackStateMock, false);

      // Then
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith(RoutePaths.PREVIOUS, {
        replace: false,
        state: { ...goBackStateMock, type: MessageTypes.ERROR },
      });
    });
  });
});
