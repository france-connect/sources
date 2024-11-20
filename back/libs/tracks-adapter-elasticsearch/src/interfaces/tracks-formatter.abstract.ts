/* istanbul ignore file */

// Declarative code

import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { BaseTracksOutputInterface } from './base-tracks-output.interface';
import { ElasticTracksType } from './elastic-tracks.type';

export abstract class TracksFormatterAbstract<
  TOutput extends BaseTracksOutputInterface,
> {
  abstract formatTrack(elasticTrack: SearchHit<ElasticTracksType>): TOutput;
}
