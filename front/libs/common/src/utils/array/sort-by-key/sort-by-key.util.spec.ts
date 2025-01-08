import { sortByKey } from './sort-by-key.util';

describe('sortByKey', () => {
  it('should sort an array of objects by the specified key', () => {
    // Given
    const arr = [
      { age: 25, name: 'John' },
      { age: 30, name: 'Alice' },
      { age: 20, name: 'Bob' },
    ];

    // When
    const sortedArr = arr.sort(sortByKey('name'));

    // Then
    expect(sortedArr).toStrictEqual([
      { age: 30, name: 'Alice' },
      { age: 20, name: 'Bob' },
      { age: 25, name: 'John' },
    ]);
  });

  it('should not sort the array if values are equal', () => {
    // Given
    const arr = [
      { age: 25, name: 'John' },
      { age: 25, name: 'Alice' },
      { age: 25, name: 'Bob' },
    ];

    // When
    const sortedArr = arr.sort(sortByKey('age'));

    // Then
    expect(sortedArr).toStrictEqual([
      { age: 25, name: 'John' },
      { age: 25, name: 'Alice' },
      { age: 25, name: 'Bob' },
    ]);
  });

  it('should sort an array of objects by the specified key with a transformer function', () => {
    // Given
    const transformer = (age: number): number => age % 3;
    const arr = [
      { age: 25, name: 'John' },
      { age: 30, name: 'Alice' },
      { age: 20, name: 'Bob' },
    ];

    // When
    const sortedArr = arr.sort(sortByKey('age', transformer));

    // Then
    expect(sortedArr).toStrictEqual([
      { age: 30, name: 'Alice' },
      { age: 25, name: 'John' },
      { age: 20, name: 'Bob' },
    ]);
  });
});
