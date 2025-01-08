import { FieldSort, SearchRequest } from '@elastic/elasticsearch/lib/api/types';

export type SearchType = Omit<SearchRequest, 'sort'> & {
  sort: { [property: string]: FieldSort }[];
};
