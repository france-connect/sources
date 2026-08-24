import { ElasticControlRangeEnum } from '../enums';
import { derivePeriod } from './derive-period.util';
import { getPreviousMonth } from './get-previous-month.util';
import { getPreviousSemester } from './get-previous-semester.util';
import { getPreviousYear } from './get-previous-year.util';

jest.mock('./get-previous-month.util');
jest.mock('./get-previous-semester.util');
jest.mock('./get-previous-year.util');

describe('derivePeriod', () => {
  const getPreviousMonthMock = jest.mocked(getPreviousMonth);
  const getPreviousSemesterMock = jest.mocked(getPreviousSemester);
  const getPreviousYearMock = jest.mocked(getPreviousYear);

  beforeEach(() => {
    jest.resetAllMocks();

    getPreviousMonthMock.mockReturnValue('2025-07');
    getPreviousSemesterMock.mockReturnValue('2025-01');
    getPreviousYearMock.mockReturnValue('2024');
  });

  it('should return previous year for YEAR range', () => {
    // When
    const result = derivePeriod(ElasticControlRangeEnum.YEAR);

    // Then
    expect(getPreviousYearMock).toHaveBeenCalledExactlyOnceWith();
    expect(result).toBe('2024');
  });

  it('should return previous semester for SEMESTER range', () => {
    // When
    const result = derivePeriod(ElasticControlRangeEnum.SEMESTER);

    // Then
    expect(getPreviousSemesterMock).toHaveBeenCalledExactlyOnceWith();
    expect(result).toBe('2025-01');
  });

  it('should return previous month for MONTH range', () => {
    // When
    const result = derivePeriod(ElasticControlRangeEnum.MONTH);

    // Then
    expect(getPreviousMonthMock).toHaveBeenCalledExactlyOnceWith();
    expect(result).toBe('2025-07');
  });

  it('should fall back to previous month for an unknown range', () => {
    // When
    const result = derivePeriod('UNKNOWN' as ElasticControlRangeEnum);

    // Then
    expect(getPreviousMonthMock).toHaveBeenCalledExactlyOnceWith();
    expect(result).toBe('2025-07');
  });
});
