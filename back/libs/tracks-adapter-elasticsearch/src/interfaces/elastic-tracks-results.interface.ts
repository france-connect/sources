import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { ElasticTracksType } from './elastic-tracks.type';

export interface ElasticTracksResultsInterface {
  total: number;
  payload: SearchHit<ElasticTracksType>[];
}
