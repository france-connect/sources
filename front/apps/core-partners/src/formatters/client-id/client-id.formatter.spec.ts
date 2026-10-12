import { truncateMiddle } from '@fc/common';
import { formatCellValue } from '@fc/dsfr';

import { formatClientId } from './client-id.formatter';

describe('formatClientId', () => {
  it('should call formatCellValue with the value', () => {
    // When
    formatClientId(undefined);

    // Then
    expect(formatCellValue).toHaveBeenCalledOnce();
  });

  it('should call truncateMiddle with the client id', () => {
    // Given
    const value = 'a1b2c3d4e5f67890abcdef1234567890';
    jest.mocked(formatCellValue).mockReturnValueOnce(value);

    // When
    formatClientId(value);

    // Then
    expect(truncateMiddle).toHaveBeenCalledExactlyOnceWith(value);
  });
});
