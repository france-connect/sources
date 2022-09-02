/* istanbul ignore file */

import { FieldSort, SearchRequest } from '@elastic/elasticsearch/lib/api/types';

// Declarative code
export type Search = Omit<SearchRequest, 'sort'> & {
  sort: { [property: string]: FieldSort }[];
};
