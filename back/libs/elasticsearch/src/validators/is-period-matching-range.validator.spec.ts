import { ValidationArguments } from 'class-validator';

import { ElasticControlRangeEnum } from '../enums';
import { IsPeriodMatchingRangeConstraint } from './is-period-matching-range.validator';

describe('IsPeriodMatchingRangeConstraint', () => {
  let constraint: IsPeriodMatchingRangeConstraint;

  const buildArgs = (range: ElasticControlRangeEnum): ValidationArguments =>
    ({ object: { range } }) as ValidationArguments;

  beforeEach(() => {
    constraint = new IsPeriodMatchingRangeConstraint();
  });

  describe('validate', () => {
    it('should return false when period is not a string', () => {
      // When
      const result = constraint.validate(
        42,
        buildArgs(ElasticControlRangeEnum.MONTH),
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when range is not in the regex map', () => {
      // When
      const result = constraint.validate(
        '2025-08',
        buildArgs('UNKNOWN' as ElasticControlRangeEnum),
      );

      // Then
      expect(result).toBe(false);
    });

    describe.each([
      {
        range: ElasticControlRangeEnum.MONTH,
        valid: '2025-08',
        invalid: '2025',
      },
      {
        range: ElasticControlRangeEnum.YEAR,
        valid: '2025',
        invalid: '2025-08',
      },
      {
        range: ElasticControlRangeEnum.SEMESTER,
        valid: '2025-07',
        invalid: '2025-08',
      },
    ])('range $range', ({ range, valid, invalid }) => {
      it(`should return true for valid period "${valid}"`, () => {
        // When
        const result = constraint.validate(valid, buildArgs(range));

        // Then
        expect(result).toBe(true);
      });

      it(`should return false for invalid period "${invalid}"`, () => {
        // When
        const result = constraint.validate(invalid, buildArgs(range));

        // Then
        expect(result).toBe(false);
      });
    });
  });

  describe('defaultMessage', () => {
    it.each([
      { range: ElasticControlRangeEnum.MONTH, expected: 'YYYY-MM' },
      { range: ElasticControlRangeEnum.YEAR, expected: 'YYYY' },
      {
        range: ElasticControlRangeEnum.SEMESTER,
        expected: 'YYYY-01 or YYYY-07',
      },
    ])(
      'should return a message mentioning $expected for range $range',
      ({ range, expected }) => {
        // When
        const message = constraint.defaultMessage(buildArgs(range));

        // Then
        expect(message).toContain(expected);
        expect(message).toContain(range);
      },
    );
  });
});
