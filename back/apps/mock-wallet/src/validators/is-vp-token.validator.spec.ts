import { IsVpTokenConstraint } from './is-vp-token.validator';

describe('IsVpTokenConstraint', () => {
  let constraint: IsVpTokenConstraint;

  beforeEach(() => {
    constraint = new IsVpTokenConstraint();
  });

  describe('validate', () => {
    it('should return true for a non-empty presentation string', () => {
      // When / Then
      expect(constraint.validate('vp-token-mock')).toBe(true);
    });

    it('should return false for an empty string', () => {
      // When / Then
      expect(constraint.validate('')).toBe(false);
    });

    it('should return true for a DCQL object mapping an id to an array of presentations', () => {
      // When / Then
      expect(constraint.validate({ 'pid-fc': ['vp-token-mock'] })).toBe(true);
    });

    it('should return true for a DCQL object with several credential query ids', () => {
      // When / Then
      expect(
        constraint.validate({ 'pid-fc': ['first'], mdl: ['second'] }),
      ).toBe(true);
    });

    it('should return false for a DCQL object with no entry', () => {
      // When / Then
      expect(constraint.validate({})).toBe(false);
    });

    it('should return false when a presentation is not wrapped in an array', () => {
      // When / Then
      expect(constraint.validate({ 'pid-fc': 'vp-token-mock' })).toBe(false);
    });

    it('should return false when the presentation array is empty', () => {
      // When / Then
      expect(constraint.validate({ 'pid-fc': [] })).toBe(false);
    });

    it('should return false when a presentation is not a non-empty string', () => {
      // When / Then
      expect(constraint.validate({ 'pid-fc': [''] })).toBe(false);
      expect(constraint.validate({ 'pid-fc': [42] })).toBe(false);
    });

    it('should return false for null', () => {
      // When / Then
      expect(constraint.validate(null)).toBe(false);
    });

    it('should return false for an array', () => {
      // When / Then
      expect(constraint.validate(['vp-token-mock'])).toBe(false);
    });

    it('should return false for a number', () => {
      // When / Then
      expect(constraint.validate(42)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      // When
      const result = constraint.defaultMessage();

      // Then
      expect(result).toBe(
        'vp_token must be a presentation string or an object mapping credential query ids to arrays of presentations',
      );
    });
  });
});
