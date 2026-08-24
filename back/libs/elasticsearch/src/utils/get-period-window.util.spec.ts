import { ElasticControlRangeEnum } from '../enums';
import {
  ElasticControlInvalidRequestException,
  ElasticControlInvalidSemesterPeriodException,
} from '../exceptions';
import { getPeriodWindow } from './get-period-window.util';

describe('getPeriodWindow', () => {
  it('should return the civil month window in Europe/Paris with a winter offset', () => {
    // When
    const result = getPeriodWindow(ElasticControlRangeEnum.MONTH, '2025-01');

    // Then
    expect(result).toEqual({
      gte: new Date('2025-01-01T00:00:00.000+01:00'),
      lt: new Date('2025-02-01T00:00:00.000+01:00'),
    });
  });

  it('should return the civil month window in Europe/Paris with a summer offset', () => {
    // When
    const result = getPeriodWindow(ElasticControlRangeEnum.MONTH, '2025-07');

    // Then
    expect(result).toEqual({
      gte: new Date('2025-07-01T00:00:00.000+02:00'),
      lt: new Date('2025-08-01T00:00:00.000+02:00'),
    });
  });

  it('should cross the year boundary for the December month', () => {
    // When
    const result = getPeriodWindow(ElasticControlRangeEnum.MONTH, '2025-12');

    // Then
    expect(result).toEqual({
      gte: new Date('2025-12-01T00:00:00.000+01:00'),
      lt: new Date('2026-01-01T00:00:00.000+01:00'),
    });
  });

  it('should return the civil year window in Europe/Paris', () => {
    // When
    const result = getPeriodWindow(ElasticControlRangeEnum.YEAR, '2024');

    // Then
    expect(result).toEqual({
      gte: new Date('2024-01-01T00:00:00.000+01:00'),
      lt: new Date('2025-01-01T00:00:00.000+01:00'),
    });
  });

  it('should return the first semester window in Europe/Paris', () => {
    // When
    const result = getPeriodWindow(ElasticControlRangeEnum.SEMESTER, '2025-01');

    // Then
    expect(result).toEqual({
      gte: new Date('2025-01-01T00:00:00.000+01:00'),
      lt: new Date('2025-07-01T00:00:00.000+02:00'),
    });
  });

  it('should return the second semester window in Europe/Paris', () => {
    // When
    const result = getPeriodWindow(ElasticControlRangeEnum.SEMESTER, '2024-07');

    // Then
    expect(result).toEqual({
      gte: new Date('2024-07-01T00:00:00.000+02:00'),
      lt: new Date('2025-01-01T00:00:00.000+01:00'),
    });
  });

  it('should throw an invalid request exception for an out-of-range month', () => {
    // Then
    expect(() =>
      getPeriodWindow(ElasticControlRangeEnum.MONTH, '2025-13'),
    ).toThrow(ElasticControlInvalidRequestException);
  });

  it('should throw an invalid request exception for a YYYY-only input on MONTH range', () => {
    // Then
    expect(() =>
      getPeriodWindow(ElasticControlRangeEnum.MONTH, '2025'),
    ).toThrow(ElasticControlInvalidRequestException);
  });

  it('should throw an invalid request exception for a malformed year on YEAR range', () => {
    // Then
    expect(() =>
      getPeriodWindow(ElasticControlRangeEnum.YEAR, '2024-01'),
    ).toThrow(ElasticControlInvalidRequestException);
  });

  it('should throw an invalid semester period exception for an invalid semester month', () => {
    // Then
    expect(() =>
      getPeriodWindow(ElasticControlRangeEnum.SEMESTER, '2025-03'),
    ).toThrow(ElasticControlInvalidSemesterPeriodException);
  });
});
