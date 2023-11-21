import { atHashFromAccessToken } from './at-hash.helper';

describe('atHashFromAccessToken', () => {
  it('should return correct at_hash', () => {
    // Given
    const input = { jti: 'd_IYuVJszDAUn6pyhtAQpEy0ifSXl-EgtJ5AX0tbKMU' };
    const expected = 'q_KM-z3JZDPNukSKjFKwEQ';
    // When
    const result = atHashFromAccessToken(input);
    // Then
    expect(result).toBe(expected);
  });
});
