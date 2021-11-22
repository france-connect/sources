import { validateCog } from './is-cog.validator';

describe('validateCog', () => {
  describe('should return "false", if the argument is not a valid cog because of', () => {
    it('is not a string', () => {
      // setup
      const notAstring = 42;

      // action
      const valid = validateCog(notAstring);

      // assert
      expect(valid).toStrictEqual(false);
    });

    it('is an empty string', () => {
      // setup
      const notAstring = '';

      // action
      const valid = validateCog(notAstring);

      // assert
      expect(valid).toStrictEqual(false);
    });

    it('is not a valid cog, length < 3', () => {
      // setup
      const cog = 'nop';

      // action
      const valid = validateCog(cog);

      // assert
      expect(valid).toStrictEqual(false);
    });

    it('last 3 chars are not numbers', () => {
      // setup
      const cog = '13p12';

      // action
      const valid = validateCog(cog);

      // assert
      expect(valid).toStrictEqual(false);
    });

    it('length === 5 but first char is not number', () => {
      // setup
      const cog = 'nop12';

      // action
      const valid = validateCog(cog);

      // assert
      expect(valid).toStrictEqual(false);
    });

    it('length === 5 but second char is not A or B', () => {
      // setup
      const cog = '1C712';

      // action
      const valid = validateCog(cog);

      // assert
      expect(valid).toStrictEqual(false);
    });
  });

  describe('return "true", if the argument is a valid cog', () => {
    it('all numbers', () => {
      // setup
      const cog = '95277';

      // action
      const valid = validateCog(cog);

      // assert
      expect(valid).toStrictEqual(true);
    });

    it('is a valid cog (CORSE 2Axxx)', () => {
      // setup
      const cog = '2A123';

      // action
      const valid = validateCog(cog);

      // assert
      expect(valid).toStrictEqual(true);
    });

    it('is a valid cog (CORSE 2Bxxx)', () => {
      // setup
      const cog = '2B123';

      // action
      const valid = validateCog(cog);

      // assert
      expect(valid).toStrictEqual(true);
    });
  });
});
