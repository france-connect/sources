import { TransformFnParams } from 'class-transformer';

import { enforceArray } from './enforce-array.transform';

describe('Enforce array transform', () => {
  describe('enforceArray', () => {
    it('should return an empty array from undefined value', () => {
      // Given
      const options = { value: undefined } as TransformFnParams;

      // When
      const result = enforceArray(options);

      // Then
      expect(result).toEqual([]);
    });

    it('should return an array from a single string', () => {
      // Given
      const options = { value: 'foo' } as TransformFnParams;

      // When
      const result = enforceArray(options);

      // Then
      expect(result).toEqual([options.value]);
    });

    it('should return an array from array', () => {
      // Given
      const options = { value: ['foo', 'bar'] } as TransformFnParams;

      // When
      const result = enforceArray(options);

      // Then
      expect(result).toEqual(options.value);
    });
  });
});
