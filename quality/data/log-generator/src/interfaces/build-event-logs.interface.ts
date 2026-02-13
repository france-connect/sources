import { DateTime } from 'luxon';

export interface BuildEventLogs {
  esIndex: string;
  accountId: string;
  data: object;
  dates: DateTime[];
  event: string;
  typeAction?: string;
}
