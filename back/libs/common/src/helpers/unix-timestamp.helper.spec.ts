import { nowInSeconds } from './unix-timestamp.helper';

describe('nowInSeconds', () => {
  it('should return the current time in seconds', () => {
    // Given
    const before = Math.floor(Date.now() / 1000);

    // When
    const result = nowInSeconds();

    // Then
    const after = Math.floor(Date.now() / 1000);
    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(after);
  });

  it('should return an integer', () => {
    // When
    const result = nowInSeconds();

    // Then
    expect(Number.isInteger(result)).toBe(true);
  });
});
