import { oneToOneScopeFromClaims } from './scopes.helper';

describe('scopeHelpers', () => {
  describe('oneToOneScopeFromClaims', () => {
    const inputMock = { foo: 'fooValue', bar: 'barValue' };

    it('should return an object with a key by entries of the array', () => {
      // When
      const result = oneToOneScopeFromClaims(inputMock);
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          fooValue: expect.any(Array),
          barValue: expect.any(Array),
        }),
      );
    });

    it('should return an object with values being arrays with one element being the key', () => {
      // When
      const result = oneToOneScopeFromClaims(inputMock);
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          fooValue: ['fooValue'],
          barValue: ['barValue'],
        }),
      );
    });
  });
});
