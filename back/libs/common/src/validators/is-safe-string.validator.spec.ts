import { isSafeString } from './is-safe-string.validator';

describe('IsSafeString', () => {
  describe('isSafeString', () => {
    it('should return true if the value is a string', () => {
      // action
      const result = isSafeString('a string');

      // expect
      expect(result).toStrictEqual(true);
    });

    it('should return true if the value is a string but empty', () => {
      // action
      const result = isSafeString('');

      // expect
      expect(result).toStrictEqual(true);
    });

    it('should return false if the value is a wrong data', () => {
      // setup
      const dataMock = {
        toString() {
          return 'no';
        },
      };

      // action
      const result = isSafeString(JSON.stringify(dataMock, null, 2));

      // expect
      expect(result).toStrictEqual(false);
    });

    it('should return false if the value is not a string', () => {
      // action
      const result = isSafeString(42 as unknown as string);

      // expect
      expect(result).toStrictEqual(false);
    });
  });
});
