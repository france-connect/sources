import { doSplit } from './split.transform';

describe('Split transform', () => {
  const options = {};

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('doSplit', () => {
    it('should return a array from string', () => {
      // setup
      const separator = '-';
      const value = 'I-will-be-back';
      const output = ['I', 'will', 'be', 'back'];
      const doSplitFn = doSplit(separator, options);

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
      const doSplitFn = doSplit(separator, options);

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
      const doSplitFn = doSplit(separator, options);

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
      const doSplitFn = doSplit(separator, options);

      // action
      const result = doSplitFn({ value });

      // assert
      expect(result).toStrictEqual(output);
    });

    it('should return [] if maxLength option is provided and the value length exceeds it', () => {
      // setup
      const separator = ' ';
      const value = 'I will be back';
      const output = [];
      const optionsMock = {
        maxLength: 2,
      };
      const doSplitFn = doSplit(separator, optionsMock);

      // action
      const result = doSplitFn({ value });

      // assert
      expect(result).toStrictEqual(output);
    });

    it('should not call split() if maxLength option is provided and the value length exceeds it', () => {
      // setup
      const separator = undefined;
      const value = 'I will be back';
      const optionsMock = {
        maxLength: 2,
      };
      const splitSpy = jest.spyOn(String.prototype, 'split');

      const doSplitFn = doSplit(separator, optionsMock);

      // action
      doSplitFn({ value });

      // assert
      expect(splitSpy).not.toHaveBeenCalled();
    });

    it('should return an array from input string if the value length is smaller than the maxLength option', () => {
      // setup
      const separator = ' ';
      const value = 'I will be back';
      const output = ['I', 'will', 'be', 'back'];
      const optionsMock = {
        maxLength: 200,
      };
      const splitSpy = jest.spyOn(String.prototype, 'split');
      const doSplitFn = doSplit(separator, optionsMock);

      // action
      const result = doSplitFn({ value });

      // assert

      expect(splitSpy).toHaveBeenCalledWith(separator);
      expect(splitSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(output);
    });
  });
});
