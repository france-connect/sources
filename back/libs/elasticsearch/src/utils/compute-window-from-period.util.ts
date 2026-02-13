import { DateTime } from 'luxon';

import { ElasticControlRangeEnum } from '../enums';

const WINDOW_MONTHS: Record<ElasticControlRangeEnum, number> = {
  [ElasticControlRangeEnum.YEAR]: 12,
  [ElasticControlRangeEnum.SEMESTER]: 6,
  [ElasticControlRangeEnum.MONTH]: 1,
};

export function computeWindowFromPeriod(
  period: string,
  range: ElasticControlRangeEnum,
  timezone: string,
): { gte: string; lt: string } {
  const base = DateTime.fromFormat(period, 'yyyy-MM', { zone: timezone });

  const windowMonths = WINDOW_MONTHS[range];
  if (windowMonths == null) throw new Error(`Unsupported range "${range}".`);

  const lt = base.plus({ months: 1 }).startOf('month').toISODate();
  const gte = base
    .minus({ months: windowMonths - 1 })
    .startOf('month')
    .toISODate();

  return { gte, lt };
}
