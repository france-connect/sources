/* istanbul ignore file */

// Declarative code

import { SearchHit } from '@elastic/elasticsearch/api/types';

import { IPaginationResult } from '@fc/common';

import { ICsmrTracksFieldsRawData } from './csmr-tracks-fields-data.interface';

export type ICsmrTracksElasticResults = {
  meta: IPaginationResult;
  payload: SearchHit<ICsmrTracksFieldsRawData>[];
};
