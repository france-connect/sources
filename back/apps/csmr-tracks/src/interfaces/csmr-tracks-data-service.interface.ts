/* istanbul ignore file */

// Declarative code

import { Search } from '@elastic/elasticsearch/api/requestParams';

import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { ICsmrTracksElasticInput } from './csmr-tracks-elastic-input.interface';

export interface IAppTracksDataService {
  formatQuery(index, accountId): Search;
  formattedTracks(
    rawTracks: ICsmrTracksElasticInput<unknown>[],
  ): Promise<ICsmrTracksOutputTrack[]>;
}
