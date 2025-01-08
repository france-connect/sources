import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { ElasticTracksType } from './elastic-tracks.type';
import { TracksFormatterOutputAbstract } from './tracks-formatter-output.abstract';

export abstract class TracksFormatterAbstract<
  TOutput extends TracksFormatterOutputAbstract,
> {
  abstract formatTrack(elasticTrack: SearchHit<ElasticTracksType>): TOutput;
}
