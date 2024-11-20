/* istanbul ignore file */

import { FieldSort, SearchRequest } from '@elastic/elasticsearch/lib/api/types';

// Declarative code
export type SearchType = Omit<SearchRequest, 'sort'> & {
  sort: { [property: string]: FieldSort }[];
};
