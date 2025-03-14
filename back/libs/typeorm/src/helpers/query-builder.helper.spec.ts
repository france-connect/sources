import { queryBuilderGetCurrentTimestamp } from './query-builder.helper';

describe('queryBuilderGetCurrentTimestamp', () => {
  it('should return CURRENT_TIMESTAMP', () => {
    // When
    const result = queryBuilderGetCurrentTimestamp();

    // Then
    expect(result).toBe('CURRENT_TIMESTAMP');
  });
});
