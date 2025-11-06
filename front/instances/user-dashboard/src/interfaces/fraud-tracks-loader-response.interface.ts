import type { FSAInterface } from '@fc/common';
import type { TrackInterface } from '@fc/core-user-dashboard';

export interface FraudTracksLoaderResponseInterface {
  data: Required<FSAInterface<TrackInterface[], { code: string }>>;
}
