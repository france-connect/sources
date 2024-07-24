import { renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { StylesContext, StylesProvider } from '../../context';
import { NotWrappedIntoProviderException } from '../../exceptions';
import { useStylesContext } from './styles-context.hook';

describe('useStylesContext', () => {
  // given
  const cssVariablesMock = new CSSStyleDeclaration();
  cssVariablesMock.setProperty('--color-primary', 'red');

  const Wrapper = ({ children }: PropsWithChildren) => <StylesProvider>{children}</StylesProvider>;

  beforeEach(() => {
    // given
    const getComputedStyleMock = jest.spyOn(window, 'getComputedStyle');
    jest.mocked(getComputedStyleMock).mockReturnValue(cssVariablesMock);
  });

  it('should throw a NotWrappedIntoProviderException error', () => {
    // given
    const message = 'useStylesContext must be wrapped into a StylesProvider';

    // @NOTE hide console.error logs into console
    // as the code below suposed to throw
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // then
    expect(() => {
      // when
      renderHook(() => useStylesContext());
    }).toThrowWithMessage(NotWrappedIntoProviderException, message);
  });

  it('should not throw an error if not wrapped in StylesProvider', () => {
    // then
    expect(() => {
      // when
      renderHook(() => useStylesContext(), { wrapper: Wrapper });
    }).not.toThrow();
  });

  it('should call useContext with StylesContext', () => {
    // given
    const useContextMock = jest.spyOn(React, 'useContext');

    // when
    renderHook(() => useStylesContext(), { wrapper: Wrapper });

    // then
    expect(useContextMock).toHaveBeenNthCalledWith(1, StylesContext);
  });

  it('should return the values from StylesContext', () => {
    // when
    const { result } = renderHook(() => useStylesContext(), { wrapper: Wrapper });

    // then
    expect(result.current).toStrictEqual({ cssVariables: cssVariablesMock });
  });
});
