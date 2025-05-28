import { countOccurrences } from './count-occurence.helper';

describe('countOccurrences', () => {
  it('should return an empty object when items array is empty', () => {
    // Given
    const items: { foo: number }[] = [];

    // When
    const result = countOccurrences(items, 'foo');

    // Then
    expect(result).toEqual({});
  });

  it('should correctly count occurrences when keys are numbers', () => {
    // Given
    const items = [{ foo: 1 }, { foo: 2 }, { foo: 1 }];

    // When
    const result = countOccurrences(items, 'foo');

    // Then
    expect(result).toEqual({
      '1': 2,
      '2': 1,
    });
  });

  it('should correctly count occurrences when keys are strings', () => {
    // Given
    const items = [{ name: 'foo' }, { name: 'bar' }, { name: 'foo' }];

    // When
    const result = countOccurrences(items, 'name');

    // Then
    expect(result).toEqual({
      foo: 2,
      bar: 1,
    });
  });

  it('should ignore undefined or falsy key values', () => {
    // Given
    const items = [{ foo: 1 }, { foo: undefined }, { foo: 1 }, { foo: null }];

    // When
    const result = countOccurrences(items, 'foo');

    // Then
    expect(result).toEqual({
      '1': 2,
    });
  });
});
