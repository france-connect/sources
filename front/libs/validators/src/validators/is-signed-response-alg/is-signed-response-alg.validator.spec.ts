import { isSignedResponseAlg } from './is-signed-response-alg.validator';

describe('isSignedResponseAlg', () => {
  it('should return true if value is ES256', () => {
    // When / Then
    expect(isSignedResponseAlg('ES256')).toBeTrue();
  });

  it('should return true if value is RS256', () => {
    // When / Then
    expect(isSignedResponseAlg('RS256')).toBeTrue();
  });

  it('should return false if value is HS256', () => {
    // When / Then
    expect(isSignedResponseAlg('HS256')).toBeFalse();
  });
});
