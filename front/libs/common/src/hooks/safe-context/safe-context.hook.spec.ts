import { renderHook } from '@testing-library/react';
import React from 'react';

import { SafeContextException } from '../../exceptions/safe-context.exception';
import { useSafeContext } from './safe-context.hook';

describe('useSafeContext', () => {
  beforeEach(() => {
    // @NOTE hide console.error logs into console
    // as the code below suposed to throw
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it('should call useContext', () => {
    // Given
    const useContextSpy = jest.spyOn(React, 'useContext');
    const ContextMock = React.createContext<string | undefined>('any context value mock');

    // When
    renderHook(() => useSafeContext(ContextMock));

    // Then
    expect(useContextSpy).toHaveBeenCalledOnce();
    expect(useContextSpy).toHaveBeenCalledWith(ContextMock);
  });

  it('should throw a SafeContextException if context value is undefined', () => {
    // Given
    const ContextMock = React.createContext<string | undefined>(undefined);

    // Then
    expect(() => {
      // When
      renderHook(() => useSafeContext(ContextMock));
    }).toThrow(SafeContextException);
  });

  it('should return the context value', () => {
    // Given
    const ContextMock = React.createContext<string | undefined>('any context value mock');

    // When
    const { result } = renderHook(() => useSafeContext(ContextMock));

    // Then
    expect(result.current).toBe('any context value mock');
  });
});
