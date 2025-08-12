import { difference } from './difference';

describe('difference', () => {
  it('should return the difference between two array', () => {
    // Given
    const array1 = ['foo', 'bar', 'toto'];
    const array2 = ['toto', 'titi'];
    const resultExpected = ['foo', 'bar'];
    // When
    const result = difference(array1, array2);
    // Then
    expect(result).toEqual(resultExpected);
  });

  it('should return the difference between array and string', () => {
    // Given
    const array = ['foo', 'bar', 'toto'];
    const string = 'toto';
    const resultExpected = ['foo', 'bar'];
    // When
    const result = difference(array, string);
    // Then
    expect(result).toEqual(resultExpected);
  });
});
