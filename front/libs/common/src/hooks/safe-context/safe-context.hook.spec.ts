import { renderHook } from '@testing-library/react';
import React from 'react';

import { SafeContextException } from '../../exceptions/safe-context.exception';
import { useSafeContext } from './safe-context.hook';

describe('useSafeContext', () => {
  it('should call useContext', () => {
    // given
    const useContextSpy = jest.spyOn(React, 'useContext');
    const ContextMock = React.createContext<string | undefined>('any context value mock');

    // when
    renderHook(() => useSafeContext(ContextMock));

    // then
    expect(useContextSpy).toHaveBeenCalledOnce();
    expect(useContextSpy).toHaveBeenCalledWith(ContextMock);
  });

  it('should throw a SafeContextException if context value is undefined', () => {
    // given
    const ContextMock = React.createContext<string | undefined>(undefined);
    // @NOTE hide console.error logs into console
    // as the code below suposed to throw
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // then
    expect(() => {
      // when
      renderHook(() => useSafeContext(ContextMock));
    }).toThrow(SafeContextException);
  });

  it('should return the context value', () => {
    // given
    const ContextMock = React.createContext<string | undefined>('any context value mock');

    // when
    const { result } = renderHook(() => useSafeContext(ContextMock));

    // then
    expect(result.current).toBe('any context value mock');
  });
});
