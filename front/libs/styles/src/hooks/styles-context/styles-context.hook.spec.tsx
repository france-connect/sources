import { renderHook } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { StylesContext } from '../../context';
import { useStylesContext } from './styles-context.hook';

describe('useStylesContext', () => {
  // Given
  const cssVariablesMock = new CSSStyleDeclaration();
  cssVariablesMock.setProperty('--color-primary', 'red');

  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue({ cssVariables: cssVariablesMock });
  });

  it('should call useSafeContext', () => {
    // When
    renderHook(() => useStylesContext());

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(StylesContext);
  });

  it('should return the values from StylesContext', () => {
    // When
    const { result } = renderHook(() => useStylesContext());

    // Then
    expect(result.current).toStrictEqual({ cssVariables: cssVariablesMock });
  });
});
