import { ArrayAsyncHelper } from './array-async.helper';

describe('ArrayAsyncHelper', () => {
  describe('filterAsync', () => {
    it('should filter array with async predicate', async () => {
      // Given
      const arr = [1, 2, 3, 4];
      const predicate = async (value: number) =>
        await Promise.resolve(value % 2 === 0);

      // When
      const result = await ArrayAsyncHelper.filterAsync(arr, predicate);

      // Then
      expect(result).toEqual([2, 4]);
    });
  });

  describe('mapAsync', () => {
    it('should map array with async predicate', async () => {
      // Given
      const arr = [1, 2, 3];
      const predicate = async (value: number) =>
        await Promise.resolve(value * 2);

      // When
      const result = await ArrayAsyncHelper.mapAsync(arr, predicate);

      // Then
      expect(result).toEqual([2, 4, 6]);
    });
  });

  describe('everyAsync', () => {
    it('should return true if all elements match async predicate', async () => {
      // Given
      const arr = [2, 4, 6];
      const predicate = async (value: number) =>
        await Promise.resolve(value % 2 === 0);

      // When
      const result = await ArrayAsyncHelper.everyAsync(arr, predicate);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if at least one element does not match async predicate', async () => {
      // Given
      const arr = [2, 4, 5];
      const predicate = async (value: number) =>
        await Promise.resolve(value % 2 === 0);

      // When
      const result = await ArrayAsyncHelper.everyAsync(arr, predicate);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('reduceAsync', () => {
    it('should reduce array with async predicate', async () => {
      // Given
      const arr = [1, 2, 3];
      const predicate = async (acc: number, value: number) =>
        await Promise.resolve(acc + value);

      // When
      const result = await ArrayAsyncHelper.reduceAsync(arr, predicate, 0);

      // Then
      expect(result).toBe(6);
    });
  });
});
