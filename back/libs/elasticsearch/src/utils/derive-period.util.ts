import { ElasticControlRangeEnum } from '@fc/elasticsearch';

import { getPreviousMonth } from './get-previous-month.util';
import { getPreviousSemester } from './get-previous-semester.util';
import { getPreviousYear } from './get-previous-year.util';

export function derivePeriod(range: ElasticControlRangeEnum): string {
  switch (range) {
    case ElasticControlRangeEnum.YEAR:
      return getPreviousYear();
    case ElasticControlRangeEnum.SEMESTER:
      return getPreviousSemester();
    case ElasticControlRangeEnum.MONTH:
    default:
      return getPreviousMonth();
  }
}
