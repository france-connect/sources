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
  // Respect ES naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  max_docs: number;
}
