import { doJoin } from './join.transform';

describe('Join transform', () => {
  describe('doJoin', () => {
    it('should return a string from array', () => {
      // Given
      const joiner = '-';
      const value = ['I', 'will', 'be', 'back'];
      const output = 'I-will-be-back';
      const doJoinFn = doJoin(joiner);

      // When
      const result = doJoinFn({ value });

      // Then
      expect(result).toStrictEqual(output);
    });

    it('should return a string from array even without joiner', () => {
      // Given
      const joiner = undefined;
      const value = ['I', 'will', 'be', 'back'];
      const output = 'I,will,be,back';
      const doJoinFn = doJoin(joiner);

      // When
      const result = doJoinFn({ value });

      // Then
      expect(result).toStrictEqual(output);
    });

    it('should return undefined if the input value is undefined', () => {
      // Given
      const joiner = undefined;
      const value = undefined;
      const output = null;
      const doJoinFn = doJoin(joiner);

      // When
      const result = doJoinFn({ value });

      // Then
      expect(result).toStrictEqual(output);
    });
  });
});
