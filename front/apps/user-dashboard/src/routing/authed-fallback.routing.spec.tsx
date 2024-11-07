import { authedFallback } from './authed-fallback.routing';

describe('authedFallback', () => {
  it('should return the corresponding mapped route for a known pathname', () => {
    // When
    const result = authedFallback({
      hash: expect.any(String),
      key: expect.any(String),
      pathname: '/fraud/form',
      search: expect.any(String),
      state: expect.any(Object),
    });

    // Then
    expect(result).toBe('/fraud');
  });

  it('should return the default fallback route for an unknown pathname', () => {
    // When
    const result = authedFallback({
      hash: expect.any(String),
      key: expect.any(String),
      pathname: expect.any(String),
      search: expect.any(String),
      state: expect.any(Object),
    });

    // Then
    expect(result).toBe('/');
  });
});
