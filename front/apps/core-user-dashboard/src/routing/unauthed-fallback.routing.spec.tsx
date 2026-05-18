import type { Location } from 'react-router';

import { unauthedFallback } from './unauthed-fallback.routing';

describe('unauthedFallback', () => {
  it('should return the corresponding mapped route for a known pathname', () => {
    // When
    const result = unauthedFallback({
      hash: expect.any(String),
      key: expect.any(String),
      pathname: '/fraud',
      search: expect.any(String),
      state: expect.any(Object),
    } as unknown as Location);

    // Then
    expect(result).toBe('/fraud/form');
  });

  it('should return the default fallback route for an unknown pathname', () => {
    // When
    const result = unauthedFallback({
      hash: expect.any(String),
      key: expect.any(String),
      pathname: expect.any(String),
      search: expect.any(String),
      state: expect.any(Object),
    } as unknown as Location);

    // Then
    expect(result).toBe('/history');
  });
});
