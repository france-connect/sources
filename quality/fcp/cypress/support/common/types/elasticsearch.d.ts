import { SearchResponse } from '@elastic/elasticsearch/api/types';

export type ElasticsearchResponseInterface = SearchResponse<
  Record<string, unknown>
>;

export interface ElasticsearchFilterInterface {
  index?: string;
  platformName?: string;
  serviceName?: string;
  eventName?: string;
  dateField?: string;
  startDate?: string;
  endDate?: string;
  size: number;
}
