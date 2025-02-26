import { SortOrder } from '../../../enums';
import { sortByKey } from './sort-by-key.util';

describe('sortByKey', () => {
  it('should sort an array of objects by the specified key in ascending order (default)', () => {
    // Given
    const arr = [
      { age: 25, name: 'John' },
      { age: 30, name: 'Alice' },
      { age: 20, name: 'Bob' },
    ];

    // When
    const sortedArr = arr.sort(sortByKey('age'));

    // Then
    expect(sortedArr).toStrictEqual([
      { age: 20, name: 'Bob' },
      { age: 25, name: 'John' },
      { age: 30, name: 'Alice' },
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

  it('should sort an array of objects by descending order', () => {
    // given
    const arr = [
      { age: 25, name: 'John' },
      { age: 30, name: 'Alice' },
      { age: 20, name: 'Bob' },
    ];

    // when
    const sortedArr = arr.sort(sortByKey('age', SortOrder.DESC));

    // then
    expect(sortedArr).toStrictEqual([
      { age: 30, name: 'Alice' },
      { age: 25, name: 'John' },
      { age: 20, name: 'Bob' },
    ]);
  });

  it('should sort an array of objects by the specified key with a transformer function', () => {
    // Given
    const transformerMock = jest.fn((age: number): number => age % 3);
    const arr = [
      { age: 25, name: 'John' },
      { age: 30, name: 'Alice' },
      { age: 20, name: 'Bob' },
    ];

    // When
    const sortedArr = arr.sort(sortByKey('age', SortOrder.ASC, transformerMock));

    // Then
    expect(sortedArr).toStrictEqual([
      { age: 30, name: 'Alice' },
      { age: 25, name: 'John' },
      { age: 20, name: 'Bob' },
    ]);
    expect(transformerMock).toHaveBeenCalledTimes(6);
    // n1, n2 calls is for the first object
    expect(transformerMock).toHaveBeenNthCalledWith(1, 30);
    expect(transformerMock).toHaveBeenNthCalledWith(2, 25);
    // n3, n4 calls is for the second object
    expect(transformerMock).toHaveBeenNthCalledWith(3, 20);
    expect(transformerMock).toHaveBeenNthCalledWith(4, 30);
    // n5, n6 calls is for the third object
    expect(transformerMock).toHaveBeenNthCalledWith(5, 20);
    expect(transformerMock).toHaveBeenNthCalledWith(6, 25);
  });
});
