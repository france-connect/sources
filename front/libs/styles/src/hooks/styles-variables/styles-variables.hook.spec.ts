import { renderHook } from '@testing-library/react';

import { useStylesContext } from '../styles-context';
import { useStylesVariables } from './styles-variables.hook';

jest.mock('../styles-context');

describe('useStylesVariables', () => {
  beforeEach(() => {
    // given
    const cssVariablesMock = new CSSStyleDeclaration();
    cssVariablesMock.setProperty('--any-css-variable-1', 'any-css-value-1');
    cssVariablesMock.setProperty('--any-css-variable-2', 'any-css-value-2');
    jest.mocked(useStylesContext).mockReturnValue({ cssVariables: cssVariablesMock });
  });

  it('should retrieve any value from a CSSStyleDeclaration', () => {
    // when
    const { result } = renderHook(() => useStylesVariables('any-css-variable-1'));

    // then
    expect(result.current).toEqual(['any-css-value-1']);
  });

  it('should return an array if value is a string', () => {
    // when
    const { result } = renderHook(() => useStylesVariables('any-css-variable-1'));

    // then
    expect(result.current).toEqual(expect.any(Array));
    expect(result.current).toHaveLength(1);
  });

  it('should return an array if value is an array', () => {
    // when
    const { result } = renderHook(() =>
      useStylesVariables(['any-css-variable-1', 'any-css-variable-2']),
    );

    // then
    expect(result.current).toEqual(expect.any(Array));
    expect(result.current).toHaveLength(2);
  });

  it('should return defined value, param is not double-dash prefixed', () => {
    // when
    const { result } = renderHook(() => useStylesVariables('any-css-variable-1'));

    // then
    expect(result.current).toEqual(['any-css-value-1']);
  });

  it('should return defined value, param is double-dash prefixed', () => {
    // when
    const { result } = renderHook(() => useStylesVariables(['--any-css-variable-1']));

    // then
    expect(result.current).toEqual(['any-css-value-1']);
  });

  it('should transform the values with a single value/transformer', () => {
    // given
    const transformer = (value: string) => `transformed-${value}`;

    // when
    const { result } = renderHook(() =>
      useStylesVariables(['--any-css-variable-1', '--any-css-variable-2'], transformer),
    );

    // then
    expect(result.current).toEqual(['transformed-any-css-value-1', 'transformed-any-css-value-2']);
  });

  it('should transform the values with multiple values/transformers', () => {
    // given
    const transformer1 = (value: string) => `transformed-1-${value}`;
    const transformer2 = (value: string) => `transformed-2-${value}`;

    // when
    const { result } = renderHook(() =>
      useStylesVariables(
        ['any-css-variable-1', 'any-css-variable-2'],
        [transformer1, transformer2],
      ),
    );

    // then
    expect(result.current).toEqual([
      'transformed-1-any-css-value-1',
      'transformed-2-any-css-value-2',
    ]);
  });

  it('should return undefined if a value is undefined', () => {
    // when
    const { result } = renderHook(() =>
      useStylesVariables(['any-css-variable-1', 'non-existing', 'any-css-variable-2']),
    );

    // then
    expect(result.current).toEqual(['any-css-value-1', undefined, 'any-css-value-2']);
  });
});
