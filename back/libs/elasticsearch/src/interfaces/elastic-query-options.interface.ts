import { SortOrder } from '@elastic/elasticsearch/lib/api/types';

export interface ElasticQueryOptionsInterface {
  offset?: number;
  size?: number;
  order?: SortOrder;
}
