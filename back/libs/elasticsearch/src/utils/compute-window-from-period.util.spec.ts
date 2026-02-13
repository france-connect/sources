import { DEFAULT_TIMEZONE } from '../constants';
import { ElasticControlRangeEnum } from '../enums';
import { computeWindowFromPeriod } from './compute-window-from-period.util';

describe('computeWindowFromPeriod', () => {
  const period = '2025-08';
  const timezone = DEFAULT_TIMEZONE;

  it('should compute correct window for MONTH range', () => {
    // Given
    const range = ElasticControlRangeEnum.MONTH;

    // When
    const result = computeWindowFromPeriod(period, range, timezone);

    // Then
    expect(result).toEqual({ gte: '2025-08-01', lt: '2025-09-01' });
  });

  it('should compute correct window for SEMESTER range', () => {
    // Given
    const range = ElasticControlRangeEnum.SEMESTER;

    // When
    const result = computeWindowFromPeriod(period, range, timezone);

    // Then
    expect(result).toEqual({ gte: '2025-03-01', lt: '2025-09-01' });
  });

  it('should compute correct window for YEAR range', () => {
    // Given
    const range = ElasticControlRangeEnum.YEAR;

    // When
    const result = computeWindowFromPeriod(period, range, timezone);

    // Then
    expect(result).toEqual({ gte: '2024-09-01', lt: '2025-09-01' });
  });

  it('should throw an error for an unsupported range', () => {
    // Given
    const invalidRange = 'invalidRange' as unknown as ElasticControlRangeEnum;

    // When / Then
    expect(() =>
      computeWindowFromPeriod(period, invalidRange, timezone),
    ).toThrow('Unsupported range "invalidRange"');
  });
});
