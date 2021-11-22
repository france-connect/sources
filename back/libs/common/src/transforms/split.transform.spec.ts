import { doSplit } from './split.transform';

describe('Split transform', () => {
  describe('doSplit', () => {
    it('should return a array from string', () => {
      // setup
      const separator = '-';
      const value = 'I-will-be-back';
      const output = ['I', 'will', 'be', 'back'];
      const doSplitFn = doSplit(separator);

      // action
      const result = doSplitFn({ value });

      // assert
      expect(result).toStrictEqual(output);
    });

    it('should return a array from string even without seperator', () => {
      // setup
      const separator = undefined;
      const value = 'I will be back';
      const output = ['I', 'will', 'be', 'back'];
      const doSplitFn = doSplit(separator);

      // action
      const result = doSplitFn({ value });

      // assert
      expect(result).toStrictEqual(output);
    });

    it('should return [] if the input value is undefined', () => {
      // setup
      const separator = undefined;
      const value = undefined;
      const output = [];
      const doSplitFn = doSplit(separator);

      // action
      const result = doSplitFn({ value });

      // assert
      expect(result).toStrictEqual(output);
    });

    it('should return [] if the value is not a string', () => {
      //setup
      const separator = ' ';
      const value = 42;
      const output = [];
      const doSplitFn = doSplit(separator);

      // action
      const result = doSplitFn({ value });

      // assert
      expect(result).toStrictEqual(output);
    });
  });
});
