/* istanbul ignore file */

// Declarative code

import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { IPaginationResult } from '@fc/common';

import { ICsmrTracksData } from './csmr-tracks-fields-data.interface';

export type ICsmrTracksElasticResults = {
  meta: IPaginationResult;
  payload: SearchHit<ICsmrTracksData>[];
};
