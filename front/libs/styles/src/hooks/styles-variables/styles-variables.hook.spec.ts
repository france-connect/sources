import { renderHook } from '@testing-library/react';

import { useStylesContext } from '../styles-context';
import { useStylesVariables } from './styles-variables.hook';

jest.mock('../styles-context');

describe('useStylesVariables', () => {
  beforeEach(() => {
    // Given
    const cssVariablesMock = new CSSStyleDeclaration();
    cssVariablesMock.setProperty('--any-css-variable-1', 'any-css-value-1');
    cssVariablesMock.setProperty('--any-css-variable-2', 'any-css-value-2');
    jest.mocked(useStylesContext).mockReturnValue({ cssVariables: cssVariablesMock });
  });

  it('should retrieve any value from a CSSStyleDeclaration', () => {
    // When
    const { result } = renderHook(() => useStylesVariables('any-css-variable-1'));

    // Then
    expect(result.current).toEqual(['any-css-value-1']);
  });

  it('should return an array if value is a string', () => {
    // When
    const { result } = renderHook(() => useStylesVariables('any-css-variable-1'));

    // Then
    expect(result.current).toEqual(expect.any(Array));
    expect(result.current).toHaveLength(1);
  });

  it('should return an array if value is an array', () => {
    // When
    const { result } = renderHook(() =>
      useStylesVariables(['any-css-variable-1', 'any-css-variable-2']),
    );

    // Then
    expect(result.current).toEqual(expect.any(Array));
    expect(result.current).toHaveLength(2);
  });

  it('should return defined value, param is not double-dash prefixed', () => {
    // When
    const { result } = renderHook(() => useStylesVariables('any-css-variable-1'));

    // Then
    expect(result.current).toEqual(['any-css-value-1']);
  });

  it('should return defined value, param is double-dash prefixed', () => {
    // When
    const { result } = renderHook(() => useStylesVariables(['--any-css-variable-1']));

    // Then
    expect(result.current).toEqual(['any-css-value-1']);
  });

  it('should transform the values with a single value/transformer', () => {
    // Given
    const transformer = (value: string) => `transformed-${value}`;

    // When
    const { result } = renderHook(() =>
      useStylesVariables(['--any-css-variable-1', '--any-css-variable-2'], transformer),
    );

    // Then
    expect(result.current).toEqual(['transformed-any-css-value-1', 'transformed-any-css-value-2']);
  });

  it('should transform the values with multiple values/transformers', () => {
    // Given
    const transformer1 = (value: string) => `transformed-1-${value}`;
    const transformer2 = (value: string) => `transformed-2-${value}`;

    // When
    const { result } = renderHook(() =>
      useStylesVariables(
        ['any-css-variable-1', 'any-css-variable-2'],
        [transformer1, transformer2],
      ),
    );

    // Then
    expect(result.current).toEqual([
      'transformed-1-any-css-value-1',
      'transformed-2-any-css-value-2',
    ]);
  });

  it('should return undefined if a value is undefined', () => {
    // When
    const { result } = renderHook(() =>
      useStylesVariables(['any-css-variable-1', 'non-existing', 'any-css-variable-2']),
    );

    // Then
    expect(result.current).toEqual(['any-css-value-1', undefined, 'any-css-value-2']);
  });
});
