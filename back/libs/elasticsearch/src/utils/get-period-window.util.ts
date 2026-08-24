import { DateTime, DurationLike } from 'luxon';

import { Type } from '@nestjs/common';

import { DEFAULT_TIMEZONE, PERIOD_REGEX_BY_RANGE } from '../constants';
import { ElasticControlRangeEnum } from '../enums';
import {
  ElasticControlBaseException,
  ElasticControlInvalidRequestException,
  ElasticControlInvalidSemesterPeriodException,
} from '../exceptions';
import { PeriodWindowInterface } from '../interfaces';

interface PeriodRangeConfigInterface {
  step: DurationLike;
  PeriodException: Type<ElasticControlBaseException>;
}

const RANGE_TO_CONFIG: Record<
  ElasticControlRangeEnum,
  PeriodRangeConfigInterface
> = {
  [ElasticControlRangeEnum.MONTH]: {
    step: { months: 1 },
    PeriodException: ElasticControlInvalidRequestException,
  },
  [ElasticControlRangeEnum.YEAR]: {
    step: { years: 1 },
    PeriodException: ElasticControlInvalidRequestException,
  },
  [ElasticControlRangeEnum.SEMESTER]: {
    step: { months: 6 },
    PeriodException: ElasticControlInvalidSemesterPeriodException,
  },
};

export function getPeriodWindow(
  range: ElasticControlRangeEnum,
  period: string,
): PeriodWindowInterface {
  const { step, PeriodException } = RANGE_TO_CONFIG[range];

  if (!PERIOD_REGEX_BY_RANGE[range].test(period)) {
    throw new PeriodException();
  }

  const [year, month = 1] = period.split('-').map(Number);
  const gte = DateTime.fromObject(
    { year, month, day: 1 },
    { zone: DEFAULT_TIMEZONE },
  );
  const lt = gte.plus(step);

  return {
    gte: gte.toJSDate(),
    lt: lt.toJSDate(),
  };
}
