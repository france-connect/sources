import { validateCog } from './is-cog.validator';

describe('validateCog', () => {
  describe('should return "false", if the argument is not a valid cog because of', () => {
    it('is not a string', () => {
      // Given
      const notAstring = 42;

      // When
      const valid = validateCog(notAstring);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('is an empty string', () => {
      // Given
      const notAstring = '';

      // When
      const valid = validateCog(notAstring);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('is not a valid cog, length < 3', () => {
      // Given
      const cog = 'nop';

      // When
      const valid = validateCog(cog);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('last 3 chars are not numbers', () => {
      // Given
      const cog = '13p12';

      // When
      const valid = validateCog(cog);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('length === 5 but first char is not number', () => {
      // Given
      const cog = 'nop12';

      // When
      const valid = validateCog(cog);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('length === 5 but second char is not A or B', () => {
      // Given
      const cog = '1C712';

      // When
      const valid = validateCog(cog);

      // Then
      expect(valid).toStrictEqual(false);
    });
  });

  describe('return "true", if the argument is a valid cog', () => {
    it('all numbers', () => {
      // Given
      const cog = '95277';

      // When
      const valid = validateCog(cog);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('is a valid cog (CORSE 2Axxx)', () => {
      // Given
      const cog = '2A123';

      // When
      const valid = validateCog(cog);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('is a valid cog (CORSE 2Bxxx)', () => {
      // Given
      const cog = '2B123';

      // When
      const valid = validateCog(cog);

      // Then
      expect(valid).toStrictEqual(true);
    });
  });
});
