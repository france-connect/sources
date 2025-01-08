import { renderHook } from '@testing-library/react';

import { useFieldMeta } from './field-meta.hook';

describe('useFieldMeta', () => {
  it('should return props with error message when meta has error', () => {
    // Given
    const meta = { error: 'Field is required', touched: true };
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current.errorMessage).toBe('Field is required');
    expect(result.current.hasError).toBeTrue();
    expect(result.current.inputClassname).not.toContain('fr-input--valid');
    expect(result.current.inputClassname).toContain('fr-input--error');
    expect(result.current.isValid).toBeFalse();
  });

  it('should return props without error message when meta does not have error', () => {
    // Given
    const meta = { error: undefined, touched: true };
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.hasError).toBeFalse();
    expect(result.current.inputClassname).toContain('fr-input--valid');
    expect(result.current.inputClassname).not.toContain('fr-input--error');
    expect(result.current.isValid).toBeTrue();
  });

  it('should return props without error message when meta is not touched', () => {
    // Given
    const meta = { error: 'Field is required', touched: false };
    const { result } = renderHook(() => useFieldMeta(meta));

    // Then
    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.hasError).toBeFalse();
    expect(result.current.inputClassname).not.toContain('fr-input--valid');
    expect(result.current.inputClassname).not.toContain('fr-input--error');
    expect(result.current.isValid).toBeFalse();
  });
});
