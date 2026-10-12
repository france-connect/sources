import type { ISODate } from '@fc/common';
import { isoToDate } from '@fc/common';

import { formatCreatedAt } from './created-at.formatter';

describe('formatCreatedAt', () => {
  it('should call isoToDate with the value', () => {
    // When
    formatCreatedAt('2024-01-15T10:00:00.000Z' as ISODate);

    // Then
    expect(isoToDate).toHaveBeenCalledExactlyOnceWith('2024-01-15T10:00:00.000Z');
  });
});
