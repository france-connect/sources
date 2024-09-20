import { renderHook } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { StylesContext } from '../../context';
import { useStylesContext } from './styles-context.hook';

describe('useStylesContext', () => {
  // given
  const cssVariablesMock = new CSSStyleDeclaration();
  cssVariablesMock.setProperty('--color-primary', 'red');

  beforeEach(() => {
    // given
    jest.mocked(useSafeContext).mockReturnValue({ cssVariables: cssVariablesMock });
  });

  it('should call useSafeContext', () => {
    // when
    renderHook(() => useStylesContext());

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(StylesContext);
  });

  it('should return the values from StylesContext', () => {
    // when
    const { result } = renderHook(() => useStylesContext());

    // then
    expect(result.current).toStrictEqual({ cssVariables: cssVariablesMock });
  });
});
