import { Strings } from '@fc/common';

import { formatCellValue } from './cell-value.formatter';

describe('formatCellValue', () => {
  it('should return N/A when not string or a number', () => {
    // When
    const result = formatCellValue(null);

    // Then
    expect(result).toBe(Strings.N_A);
  });

  it('should return N/A when value is null', () => {
    // When
    const result = formatCellValue(null);

    // Then
    expect(result).toBe(Strings.N_A);
  });

  it('should return N/A when value is undefined', () => {
    // When
    const result = formatCellValue(undefined);

    // Then
    expect(result).toBe(Strings.N_A);
  });

  it('should return N/A when value is empty', () => {
    // When
    const result = formatCellValue('');

    // Then
    expect(result).toBe(Strings.N_A);
  });

  it('should return N/A when value is whitespace only', () => {
    // When
    const result = formatCellValue('   ');

    // Then
    expect(result).toBe(Strings.N_A);
  });

  it('should trim the value', () => {
    // When
    const result = formatCellValue('  sangoku-kakarotto  ');

    // Then
    expect(result).toBe('sangoku-kakarotto');
  });

  it('should return the value as a string when it is a number', () => {
    // When
    const result = formatCellValue(1234567890);

    // Then
    expect(result).toBe('1234567890');
  });
});
