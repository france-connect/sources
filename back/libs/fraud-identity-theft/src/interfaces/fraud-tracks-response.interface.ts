import { SanitizedTrackDto } from '@fc/csmr-fraud-client';

export interface FraudTracksResponseMetaInterface {
  code: string;
}

export interface FraudTracksResponseInterface {
  meta: FraudTracksResponseMetaInterface;
  payload: SanitizedTrackDto[];
}
