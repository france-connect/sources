import { unique } from './unique';

describe('unique', () => {
  it('should return an array with unique value', () => {
    // Given
    const array = ['foo', 'bar', 'toto', 'toto', 'titi', 'foo'];
    const resultExpected = ['foo', 'bar', 'toto', 'titi'];
    // When
    const result = unique(array);
    // Then
    expect(result).toEqual(resultExpected);
  });
});
