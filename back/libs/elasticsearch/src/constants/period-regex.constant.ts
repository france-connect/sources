import { ElasticControlRangeEnum } from '../enums';

export const PERIOD_REGEX_BY_RANGE: Record<ElasticControlRangeEnum, RegExp> = {
  [ElasticControlRangeEnum.MONTH]: /^\d{4}-(0[1-9]|1[0-2])$/,
  [ElasticControlRangeEnum.YEAR]: /^\d{4}$/,
  [ElasticControlRangeEnum.SEMESTER]: /^\d{4}-(01|07)$/,
};
