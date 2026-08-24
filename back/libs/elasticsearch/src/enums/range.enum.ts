export enum ElasticControlRangeEnum {
  YEAR = 'year',
  SEMESTER = 'semester',
  MONTH = 'month',
}

// The source is already bounded to the period, so the histogram yields a single
// bucket; it only stamps a real date into `period` for Kibana.
// SEMESTER is absent on purpose: ES has no half-year interval, so it gets no
// date_histogram and its `period` is injected at reindex time.
export const RANGE_TO_CALENDAR_INTERVAL: Partial<
  Record<ElasticControlRangeEnum, string>
> = {
  [ElasticControlRangeEnum.MONTH]: '1M',
  [ElasticControlRangeEnum.YEAR]: '1y',
};
