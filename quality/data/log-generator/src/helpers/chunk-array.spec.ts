import { chunkArray } from './chunk-array';

describe('chunkArray', () => {
  it('should split array into chunks of specified size', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const result = chunkArray(input, 2);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should handle arrays with remainder elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = chunkArray(input, 2);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should return single chunk when chunk size is larger than array', () => {
    const input = [1, 2, 3];
    const result = chunkArray(input, 5);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should return empty array when input is empty', () => {
    const input: number[] = [];
    const result = chunkArray(input, 2);
    expect(result).toEqual([]);
  });

  it('should work with different data types', () => {
    const input = ['a', {}, 12, 'd'];
    const result = chunkArray(input, 2);
    expect(result).toEqual([
      ['a', {}],
      [12, 'd'],
    ]);
  });

  it('should return array with single element chunks', () => {
    const input = [1, 2, 3];
    const result = chunkArray(input, 1);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('should throw an error when chunk size is lower than one', () => {
    const input = [1, 2, 3];
    expect(() => chunkArray(input, 0)).toThrow('Chunk size must be at least 1');
  });

  it('should throw an error when the first parameter is not an array', () => {
    const input = 1 as unknown as number[];
    expect(() => chunkArray(input, 0)).toThrow(
      'The first parameter must be an array',
    );
  });
});
